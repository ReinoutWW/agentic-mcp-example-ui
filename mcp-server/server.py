# server.py
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("demo-math", version="0.1.0")

@mcp.tool()
def add(a: int, b: int) -> int:
    """Return a + b"""
    return a + b

if __name__ == "__main__":
    # Lightest transport for local dev: streamable HTTP on :5000
    mcp.run(transport="streamable-http", host="0.0.0.0", port=5000) 