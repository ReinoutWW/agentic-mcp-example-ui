FROM python:3.12-slim

WORKDIR /app
COPY main.py .

RUN pip install openai-agents fastapi uvicorn "mcp[cli]"

EXPOSE 8000
CMD ["python", "main.py"] 