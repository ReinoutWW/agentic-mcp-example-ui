# server.py
from mcp.server.fastmcp import FastMCP
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import re
import time
import uvicorn

# Create both MCP and FastAPI instances
mcp = FastMCP("demo-tools", version="0.1.0")
app = FastAPI(title="MCP Tools Server", version="0.1.0")

# Tool functions
@mcp.tool()
def add(a: int, b: int) -> int:
    """Return a + b"""
    return a + b

@mcp.tool()
def reset_camas_password(email: str) -> dict:
    """Reset password for CAMAS platform user
    
    Args:
        email: The email address of the user whose password needs to be reset
        
    Returns:
        dict: Status of the password reset operation
    """
    # Basic email validation
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    if not re.match(email_pattern, email):
        return {
            "success": False,
            "message": "Invalid email address format",
            "email": email,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
    
    # Simulate processing time
    time.sleep(0.5)
    
    # Always return success for demo purposes
    return {
        "success": True,
        "message": f"Password reset email sent successfully to {email}",
        "email": email,
        "platform": "CAMAS",
        "reset_token": f"rst_{int(time.time())}_{hash(email) % 10000:04d}",
        "expires_in": "24 hours",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }

# HTTP API Models
class AddRequest(BaseModel):
    a: int
    b: int

class ResetPasswordRequest(BaseModel):
    email: str

# HTTP API Endpoints
@app.get("/tools")
async def get_tools():
    """Get available tools"""
    return [
        {
            "name": "add",
            "description": "Add two numbers together",
            "parameters": {"a": "integer", "b": "integer"}
        },
        {
            "name": "reset_camas_password", 
            "description": "Reset password for CAMAS platform user",
            "parameters": {"email": "string"}
        }
    ]

@app.post("/call/add")
async def call_add(request: AddRequest):
    """Call the add tool via HTTP"""
    try:
        result = add(request.a, request.b)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/call/reset_camas_password")
async def call_reset_password(request: ResetPasswordRequest):
    """Call the reset_camas_password tool via HTTP"""
    try:
        result = reset_camas_password(request.email)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "MCP Tools Server",
        "version": "0.1.0",
        "available_tools": ["add", "reset_camas_password"]
    }

if __name__ == "__main__":
    # Run the HTTP API server
    uvicorn.run(app, host="0.0.0.0", port=8000) 