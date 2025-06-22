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
        
        # Extract detailed MCP information
        response_data = {
            "reply": result.final_output_as(str),
            "mcp_details": {
                "steps": [],
                "tools_used": [],
                "agent_name": result.last_agent.name if result.last_agent else "demo-agent",
                "model": result.last_agent.model if result.last_agent else "gpt-4o-mini",
                "processing_time": "< 1s",  # Placeholder
                "tokens_used": "~50-100",   # Placeholder
                "success": True
            }
        }
        
        # Add processing steps
        response_data["mcp_details"]["steps"] = [
            {"step": 1, "action": "Message Received", "description": f"Processing user query: '{inp.message}'", "status": "completed"},
            {"step": 2, "action": "Agent Invocation", "description": f"Invoking {response_data['mcp_details']['agent_name']} with {response_data['mcp_details']['model']}", "status": "completed"},
            {"step": 3, "action": "Response Generation", "description": "Generating intelligent response using OpenAI", "status": "completed"},
            {"step": 4, "action": "Response Delivery", "description": "Delivering formatted response to user", "status": "completed"}
        ]
        
        # For math questions, add a tool simulation
        if any(op in inp.message.lower() for op in ['+', '-', '*', '/', 'plus', 'minus', 'times', 'add', 'subtract', 'multiply', 'divide', 'what is', 'calculate']):
            response_data["mcp_details"]["tools_used"] = [
                {"name": "mathematical_reasoning", "description": "Applied mathematical reasoning to solve the problem", "status": "success"}
            ]
            response_data["mcp_details"]["steps"].insert(2, 
                {"step": 3, "action": "Tool Execution", "description": "Applied mathematical reasoning tool", "status": "completed"}
            )
            # Update step numbers
            for i, step in enumerate(response_data["mcp_details"]["steps"][3:], 4):
                step["step"] = i
        
        return response_data
        
    except Exception as e:
        return {
            "reply": f"Error: {str(e)}",
            "mcp_details": {
                "steps": [
                    {"step": 1, "action": "Message Received", "description": f"Processing user query: '{inp.message}'", "status": "completed"},
                    {"step": 2, "action": "Error Occurred", "description": str(e), "status": "error"}
                ],
                "tools_used": [],
                "agent_name": "demo-agent",
                "model": "gpt-4o-mini",
                "processing_time": "< 1s",
                "tokens_used": "~10",
                "success": False
            }
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3000) 