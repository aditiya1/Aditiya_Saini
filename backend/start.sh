#!/bin/bash

# Start the FastAPI server
echo "Starting Portfolio Chatbot Backend..."
echo "Make sure you have:"
echo "1. Created a .env file with OPENAI_API_KEY"
echo "2. Run initialize_knowledge_base.py to set up the vector database"
echo ""

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

