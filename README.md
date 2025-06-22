# MCP Demo Project

This is a complete end-to-end demo showcasing the Model Context Protocol (MCP) with three cleanly separated components:

## Architecture

1. **MCP Server** (`mcp-server/`) - Exposes tools over MCP protocol
2. **Agent Backend** (`agent-backend/`) - OpenAI-Agents loop that uses MCP tools  
3. **Frontend** (`frontend/`) - React UI for interacting with the agent

## Prerequisites

- Python 3.12+ with virtual environment support
- Node.js 22+ 
- Docker (optional, for containerized deployment)
- OpenAI API key

## Quick Start

### 1. Set up Python environment

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install "mcp[cli]" openai-agents fastapi uvicorn
```

### 2. Set up environment variables

```bash
cp env.example .env
# Edit .env and add your OpenAI API key
```

### 3. Run the components

#### Option A: Docker Compose (Recommended)

```bash
docker compose up --build
```

Then open http://localhost:5173

#### Option B: Manual (Development)

Terminal 1 - MCP Server:
```bash
source .venv/bin/activate
cd mcp-server
python server.py
```

Terminal 2 - Agent Backend:  
```bash
source .venv/bin/activate
export OPENAI_API_KEY="your-key-here"
cd agent-backend
python main.py
```

Terminal 3 - Frontend:
```bash
cd frontend  
npm run dev
```

Then open http://localhost:5173

## Testing

1. Open the frontend in your browser
2. Type: "What is 41 + 1?"
3. Watch the chain: user → agent → MCP(add) → agent → UI

## Project Structure

```
mcp-proj/
├── mcp-server/
│   ├── server.py          # 40-line MCP server with add() tool
│   └── Dockerfile
├── agent-backend/
│   ├── main.py           # FastAPI app with OpenAI-Agents
│   └── Dockerfile  
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Simple chat interface
│   │   └── main.jsx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Development

### MCP Server Inspector
Test the MCP server directly:
```bash
source .venv/bin/activate
mcp dev mcp-server/server.py
```

### Adding New Tools
Edit `mcp-server/server.py` and add more `@mcp.tool()` functions:

```python
@mcp.tool()
def multiply(a: int, b: int) -> int:
    """Return a * b"""
    return a * b
```

### Extending the Agent
The agent automatically discovers all MCP tools. No changes needed in the backend when adding new tools.

## Ports

- MCP Server: 5000
- Agent Backend: 8000  
- Frontend: 5173 (dev) / 4173 (production)

## Troubleshooting

1. **OpenAI API Key**: Make sure `OPENAI_API_KEY` is set in your environment
2. **Port conflicts**: Check if ports 5000, 8000, or 5173 are already in use
3. **Docker**: Ensure Docker is running for containerized deployment 