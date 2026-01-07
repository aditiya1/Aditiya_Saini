#!/bin/bash
# Build script for Render deployment

set -e  # Exit on error

echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Verifying installations..."
python -c "import fastapi; import uvicorn; import dotenv; print('All dependencies installed successfully')"

echo "Initializing knowledge base..."
python initialize_knowledge_base.py

echo "Build complete!"

