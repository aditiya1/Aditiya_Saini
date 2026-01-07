#!/bin/bash
# Build script for Render deployment

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Initializing knowledge base..."
python initialize_knowledge_base.py

echo "Build complete!"

