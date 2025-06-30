# MCP Demo Project - Code Explanation

## Overview

This project demonstrates the **Model Context Protocol (MCP)** through a complete end-to-end application with three cleanly separated components that work together to create a chat interface where users can interact with an AI agent that has access to mathematical tools.

## Architecture Flow

```
User Input → Frontend (React) → Agent Backend (FastAPI + OpenAI) → MCP Server (Python) → Mathematical Tools
```

## Component Breakdown

### 1. MCP Server (`mcp-server/server.py`)

**Purpose**: Exposes mathematical tools over the MCP protocol

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("demo-math", version="0.1.0")

@mcp.tool()
def add(a: int, b: int) -> int:
    """Return a + b"""
    return a + b

if __name__ == "__main__":
    mcp.run(transport="streamable-http", host="0.0.0.0", port=5000)
```

**Key Features**:
- **FastMCP Framework**: Uses the FastMCP library to create an MCP server
- **Tool Registration**: The `@mcp.tool()` decorator exposes the `add` function as an MCP tool
- **HTTP Transport**: Runs on port 5000 using streamable HTTP transport
- **Automatic Discovery**: Tools are automatically discoverable by MCP clients
- **Type Safety**: Function signatures provide type information for the protocol

### 2. Agent Backend (`agent-backend/main.py`)

**Purpose**: Bridges the frontend and MCP server using OpenAI's agent system

```python
# MCP Client Setup
async def mcp_session():
    async with streamablehttp_client("http://mcp-server:5000/mcp") as (r, w, _):
        async with ClientSession(r, w) as s:
            await s.initialize()
            yield s

# Agent Configuration
llm = OpenAI Chat(model="gpt-4o-mini", api_key=OPENAI_API_KEY)
agent = Agent(llm, name="demo-agent")

# Tool Registration
async def bootstrap():
    async for session in mcp_session():
        await agent.add_mcp_server(session)
```

**Key Features**:
- **FastAPI Server**: RESTful API on port 8000
- **OpenAI Integration**: Uses `gpt-4o-mini` model for natural language processing
- **MCP Client**: Connects to the MCP server to access tools
- **Agent System**: Uses OpenAI-Agents library for tool orchestration
- **Automatic Tool Discovery**: Agent automatically discovers and uses MCP tools
- **Async Architecture**: Handles concurrent requests efficiently

**API Endpoint**:
- `POST /chat`: Accepts user messages and returns agent responses

### 3. Frontend (`frontend/src/App.jsx`)

**Purpose**: Provides a simple chat interface for users

```javascript
const [msg, setMsg] = useState("")
const [history, setHistory] = useState([])

async function send() {
  const res = await fetch("http://localhost:8000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg })
  })
  const data = await res.json()
  setHistory(h => [...h, ["user", msg], ["bot", data.reply]])
  setMsg("")
}
```

**Key Features**:
- **React Framework**: Simple, modern UI using React hooks
- **State Management**: Manages chat history and current message
- **HTTP Client**: Makes POST requests to the agent backend
- **Real-time Updates**: Updates chat history immediately after responses
- **Responsive Design**: Uses Tailwind CSS for styling

## Data Flow Example

When a user types "What is 41 + 1?":

1. **Frontend** captures the input and sends it to `/chat` endpoint
2. **Agent Backend** receives the message and passes it to the OpenAI agent
3. **OpenAI Agent** analyzes the message and determines it needs to use the `add` tool
4. **Agent Backend** connects to the **MCP Server** via the MCP protocol
5. **MCP Server** executes `add(41, 1)` and returns `42`
6. **Agent Backend** receives the result and generates a natural language response
7. **Frontend** displays the conversation: "The answer is 42"

## Deployment Options

### Docker Compose (Recommended)
```yaml
services:
  mcp-server:
    build: ./mcp-server
    ports: ["5000:5000"]
  agent:
    build: ./agent-backend
    environment:
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    depends_on: [mcp-server]
    ports: ["8000:8000"]
  frontend:
    build: ./frontend
    depends_on: [agent]
    ports: ["5173:4173"]
```

**Features**:
- **Service Orchestration**: All three components run together
- **Dependency Management**: Services wait for dependencies to be ready
- **Environment Variables**: OpenAI API key passed securely
- **Port Mapping**: External access to each service

### Manual Development
- **Terminal 1**: MCP Server on port 5000
- **Terminal 2**: Agent Backend on port 8000  
- **Terminal 3**: Frontend on port 5173

## Technical Strengths

1. **Clean Separation**: Each component has a single responsibility
2. **Protocol-Based**: Uses MCP for tool discovery and execution
3. **Extensible**: Easy to add new tools to the MCP server
4. **Modern Stack**: Uses current best practices (FastAPI, React, Docker)
5. **Type Safety**: TypeScript/Python type hints throughout
6. **Async Architecture**: Non-blocking operations for better performance

## Extension Points

1. **Add New Tools**: Simply add more `@mcp.tool()` functions to `server.py`
2. **Enhanced UI**: Improve the React frontend with better styling/features
3. **Multiple Models**: Support different LLM providers in the agent
4. **Persistent Storage**: Add database integration for chat history
5. **Authentication**: Add user management and API security

This architecture demonstrates how MCP enables loose coupling between AI agents and their tools, making it easy to build composable AI systems.