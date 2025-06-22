# main.py
import os, asyncio, uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import agents
from agents import Agent, Runner, set_default_openai_key

OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
set_default_openai_key(OPENAI_API_KEY)

# Define a single-shot agent
agent = Agent(
    name="demo-agent",
    instructions="You are a helpful assistant that can perform mathematical calculations. For now, just respond to math questions directly.",
    model="gpt-4o-mini"
)

# Create a runner
runner = Runner()

app = FastAPI()

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatIn(BaseModel):
    message: str

@app.post("/chat")
async def chat(inp: ChatIn):
    try:
        result = await runner.run(agent, inp.message)
        return {"reply": result.final_output_as(str)}
    except Exception as e:
        return {"reply": f"Error: {str(e)}"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3000) 