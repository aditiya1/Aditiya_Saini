from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from .models.chat import ChatRequest, ChatResponse
from .services.rag_service import RAGService

# Load environment variables
load_dotenv()

app = FastAPI(title="Portfolio Chatbot API", version="1.0.0")

# CORS configuration
cors_origins_env = os.getenv("CORS_ORIGINS", "")
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://aditiya1.github.io",
    "https://aditiya1.github.io/Aditiya_Saini",
]

# Add additional origins from environment variable
if cors_origins_env:
    origins.extend([origin.strip() for origin in cors_origins_env.split(",") if origin.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG service
rag_service = None

@app.on_event("startup")
async def startup_event():
    """Initialize RAG service on startup."""
    global rag_service
    try:
        rag_service = RAGService()
        print("RAG service initialized successfully")
    except Exception as e:
        print(f"Error initializing RAG service: {str(e)}")
        raise

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "Portfolio Chatbot API",
        "vector_store_count": rag_service.vector_store.get_collection_count() if rag_service else 0
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Main chat endpoint."""
    if not rag_service:
        raise HTTPException(status_code=503, detail="RAG service not initialized")
    
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    try:
        response = rag_service.query(request.message.strip())
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

