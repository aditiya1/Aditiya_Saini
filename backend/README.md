# Portfolio Chatbot Backend

FastAPI backend for the AI-powered portfolio chatbot with RAG (Retrieval-Augmented Generation) pipeline.

## Features

- **RAG Pipeline**: Semantic search using vector embeddings
- **Vector Database**: ChromaDB for efficient similarity search
- **OpenAI Integration**: GPT-4 for response generation
- **RESTful API**: FastAPI with CORS support

## Setup

### Prerequisites

- Python 3.9 or higher
- OpenAI API key

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file:
```bash
cp .env.example .env
```

5. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_openai_api_key_here
CORS_ORIGINS=http://localhost:3000,https://aditiya1.github.io
```

### Initialize Knowledge Base

Before running the server, initialize the vector database:

```bash
python initialize_knowledge_base.py
```

This will:
- Process resume, portfolio content, and projects
- Generate embeddings using OpenAI
- Store them in ChromaDB

### Run the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /api/health
```

### Chat
```
POST /api/chat
Body: {
  "message": "What is Adi's experience?"
}
```

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── models/              # Pydantic models
│   ├── services/            # Business logic
│   │   ├── rag_service.py
│   │   ├── embedding_service.py
│   │   └── vector_store.py
│   └── utils/               # Utilities
├── data/                    # Knowledge base files
├── initialize_knowledge_base.py
└── requirements.txt
```

## Deployment

For production deployment, consider:
- Render
- Railway
- Fly.io
- AWS/GCP/Azure

Make sure to set environment variables in your hosting platform.

