"""
FastAPI wrapper for the Customer Support Agent
This creates a REST API endpoint that the Next.js frontend can call
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
import sys
import os

# Add parent directory to path to import agent modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from customer_support_agent import agent
from config import config

# Initialize FastAPI app
app = FastAPI(
    title="VEYOR Customer Support Agent API",
    description="REST API for the LangChain-powered customer support agent",
    version="1.0.0"
)

# Configure CORS to allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        "http://localhost:3001",  # Alternative port
        "https://your-production-domain.com"  # Add your production domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response models
class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default"
    user_id: Optional[str] = None
    chat_history: Optional[List[ChatMessage]] = []


class ChatResponse(BaseModel):
    response: str
    session_id: str
    metadata: Optional[dict] = None


class HealthResponse(BaseModel):
    status: str
    agent_loaded: bool
    backend_url: str


# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Check if the API and agent are running properly."""
    return HealthResponse(
        status="healthy",
        agent_loaded=True,
        backend_url=config.VEYOR_api.base_url
    )


# Main chat endpoint
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process a customer support query through the LangChain agent.
    
    Args:
        request: ChatRequest with message, session_id, and optional chat_history
        
    Returns:
        ChatResponse with the agent's response
    """
    try:
        # Prepare metadata for LangSmith tracking
        metadata = {
            "session_id": request.session_id,
            "channel": "web_chat"
        }
        
        if request.user_id:
            metadata["user_id"] = request.user_id
        
        # Convert chat history to LangChain format if provided
        chat_history = []
        if request.chat_history:
            for msg in request.chat_history:
                if msg.role == "user":
                    chat_history.append(("human", msg.content))
                elif msg.role == "assistant":
                    chat_history.append(("ai", msg.content))
        
        # Invoke the agent
        result = agent.invoke(
            query=request.message,
            chat_history=chat_history,
            metadata=metadata
        )
        
        # Extract response
        response_text = result.get("output", "I apologize, but I couldn't process your request.")
        
        return ChatResponse(
            response=response_text,
            session_id=request.session_id,
            metadata={
                "langsmith_trace": "Check LangSmith for full trace",
                "tools_used": len(result.get("intermediate_steps", []))
            }
        )
        
    except Exception as e:
        # Log error and return user-friendly message
        print(f"Error processing chat request: {e}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your request. Please try again."
        )


# Test endpoint
@app.get("/test")
async def test():
    """Simple test endpoint."""
    return {"message": "Customer Support Agent API is running!"}


if __name__ == "__main__":
    print("=" * 60)
    print("Starting Customer Support Agent API")
    print("=" * 60)
    print(f"Backend URL: {config.VEYOR_api.base_url}")
    print(f"LangSmith Tracing: {config.langsmith.tracing_enabled}")
    print(f"OpenAI Model: {config.openai.model}")
    print("=" * 60)
    print()
    print("API will be available at:")
    print("  - http://localhost:8000")
    print("  - Docs: http://localhost:8000/docs")
    print()
    
    # Run the API server
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
