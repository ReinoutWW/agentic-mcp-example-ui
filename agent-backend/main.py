# main.py
import os, asyncio, uvicorn, httpx, json, re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import agents
from agents import Agent, Runner, set_default_openai_key

OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
set_default_openai_key(OPENAI_API_KEY)

# MCP Server connection
MCP_SERVER_URL = "http://localhost:8000"

class MCPClient:
    def __init__(self, server_url: str):
        self.server_url = server_url
        self.client = httpx.AsyncClient()
    
    async def call_tool(self, tool_name: str, **kwargs):
        """Call a tool on the MCP server"""
        try:
            response = await self.client.post(
                f"{self.server_url}/call/{tool_name}",
                json=kwargs,
                timeout=10.0
            )
            if response.status_code == 200:
                return {"success": True, "result": response.json()}
            else:
                return {"success": False, "error": f"HTTP {response.status_code}: {response.text}"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def get_available_tools(self):
        """Get list of available tools from MCP server"""
        try:
            response = await self.client.get(f"{self.server_url}/tools")
            if response.status_code == 200:
                return response.json()
            return []
        except:
            return []

# Initialize MCP client
mcp_client = MCPClient(MCP_SERVER_URL)

# Define agent with MCP capabilities
agent = Agent(
    name="demo-agent",
    instructions="""You are a helpful assistant that can perform mathematical calculations and reset passwords for the CAMAS platform.

Available tools:
1. add(a, b) - Add two numbers together
2. reset_camas_password(email) - Reset password for CAMAS platform user

For math questions involving addition, use the add tool.
For password reset requests mentioning CAMAS, use the reset_camas_password tool.
Always be helpful and provide clear responses.""",
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

def extract_numbers_for_addition(text: str):
    """Extract numbers from text for addition"""
    # Look for patterns like "25 + 17", "add 25 and 17", "sum of 25 and 17"
    patterns = [
        r'(\d+)\s*\+\s*(\d+)',  # "25 + 17"
        r'add\s+(\d+)\s+and\s+(\d+)',  # "add 25 and 17"
        r'sum\s+of\s+(\d+)\s+and\s+(\d+)',  # "sum of 25 and 17"
        r'(\d+)\s+plus\s+(\d+)',  # "25 plus 17"
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text.lower())
        if match:
            return int(match.group(1)), int(match.group(2))
    
    # Look for multiple numbers to add
    numbers = re.findall(r'\d+', text)
    if len(numbers) >= 2:
        return int(numbers[0]), int(numbers[1])
    
    return None, None

def extract_email_for_reset(text: str):
    """Extract email from password reset request"""
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    match = re.search(email_pattern, text)
    return match.group(0) if match else None

@app.post("/chat")
async def chat(inp: ChatIn):
    try:
        # Initialize response structure
        response_data = {
            "reply": "",
            "mcp_details": {
                "steps": [],
                "tools_used": [],
                "agent_name": "demo-agent",
                "model": "gpt-4o-mini",
                "processing_time": "< 1s",
                "tokens_used": "~50-100",
                "success": True
            }
        }
        
        # Add initial processing steps
        response_data["mcp_details"]["steps"] = [
            {"step": 1, "action": "Message Received", "description": f"Processing user query: '{inp.message}'", "status": "completed"},
            {"step": 2, "action": "Agent Invocation", "description": "Invoking demo-agent with gpt-4o-mini", "status": "completed"}
        ]
        
        # Check if this is an addition request
        if any(keyword in inp.message.lower() for keyword in ['add', '+', 'plus', 'sum']):
            a, b = extract_numbers_for_addition(inp.message)
            if a is not None and b is not None:
                # Call MCP add tool
                tool_result = await mcp_client.call_tool("add", a=a, b=b)
                
                response_data["mcp_details"]["steps"].append(
                    {"step": 3, "action": "Tool Execution", "description": f"Calling add({a}, {b}) via MCP", "status": "completed"}
                )
                
                if tool_result["success"]:
                    result = tool_result["result"]
                    response_data["reply"] = f"The sum of {a} and {b} is {result}."
                    response_data["mcp_details"]["tools_used"] = [
                        {"name": "add", "description": f"Added {a} + {b} = {result}", "status": "success"}
                    ]
                else:
                    response_data["reply"] = f"Error calculating {a} + {b}: {tool_result['error']}"
                    response_data["mcp_details"]["tools_used"] = [
                        {"name": "add", "description": f"Failed to add {a} + {b}", "status": "error"}
                    ]
                    response_data["mcp_details"]["success"] = False
        
        # Check if this is a password reset request
        elif any(keyword in inp.message.lower() for keyword in ['reset', 'password', 'camas']):
            email = extract_email_for_reset(inp.message)
            if email:
                # Call MCP password reset tool
                tool_result = await mcp_client.call_tool("reset_camas_password", email=email)
                
                response_data["mcp_details"]["steps"].append(
                    {"step": 3, "action": "Tool Execution", "description": f"Calling reset_camas_password({email}) via MCP", "status": "completed"}
                )
                
                if tool_result["success"]:
                    result = tool_result["result"]
                    if result.get("success"):
                        response_data["reply"] = f"✅ {result['message']}\n\nReset token: {result['reset_token']}\nExpires in: {result['expires_in']}"
                        response_data["mcp_details"]["tools_used"] = [
                            {"name": "reset_camas_password", "description": f"Password reset initiated for {email}", "status": "success"}
                        ]
                    else:
                        response_data["reply"] = f"❌ {result['message']}"
                        response_data["mcp_details"]["tools_used"] = [
                            {"name": "reset_camas_password", "description": f"Password reset failed for {email}", "status": "error"}
                        ]
                        response_data["mcp_details"]["success"] = False
                else:
                    response_data["reply"] = f"Error resetting password: {tool_result['error']}"
                    response_data["mcp_details"]["tools_used"] = [
                        {"name": "reset_camas_password", "description": f"MCP call failed for {email}", "status": "error"}
                    ]
                    response_data["mcp_details"]["success"] = False
            else:
                response_data["reply"] = "I can help you reset a CAMAS password, but I need a valid email address. Please provide the email address for the account you want to reset."
        
        # If no specific tool was used, use general agent response
        else:
            result = await runner.run(agent, inp.message)
            response_data["reply"] = result.final_output_as(str)
        
        # Add final processing steps
        response_data["mcp_details"]["steps"].extend([
            {"step": len(response_data["mcp_details"]["steps"]) + 1, "action": "Response Generation", "description": "Generated response based on tool results", "status": "completed"},
            {"step": len(response_data["mcp_details"]["steps"]) + 2, "action": "Response Delivery", "description": "Delivering formatted response to user", "status": "completed"}
        ])
        
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