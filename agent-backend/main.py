# main.py
import os, asyncio, uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from openai_agents.agent import Agent
from openai_agents.llms import OpenAIChat
from mcp.client.streamable_http import streamablehttp_client
from mcp.client.session import ClientSession

OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]

# 2-line helper that returns a ready MCP client session
async def mcp_session():
    async with streamablehttp_client("http://mcp-server:5000/mcp") as (r, w, _):
        async with ClientSession(r, w) as s:
            await s.initialize()
            yield s

# Define a single-shot agent
llm = OpenAIChat(model="gpt-4o-mini", api_key=OPENAI_API_KEY)
agent = Agent(llm, name="demo-agent")

# Tell the agent about the remote MCP tool
async def bootstrap():
    async for session in mcp_session():
        await agent.add_mcp_server(session)

app = FastAPI()

class ChatIn(BaseModel):
    message: str

@app.post("/chat")
async def chat(inp: ChatIn):
    await bootstrap()          # guaranteed idempotent
    result = await agent.complete(inp.message)
    return {"reply": result.content}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 