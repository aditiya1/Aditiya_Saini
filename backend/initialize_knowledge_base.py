"""
Script to initialize the knowledge base by processing documents and creating embeddings.
Run this script once to set up the vector database.
"""
import os
import sys
from dotenv import load_dotenv

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.embedding_service import EmbeddingService
from app.services.vector_store import VectorStore
from app.utils.text_processing import clean_text, chunk_text

# Load environment variables
load_dotenv()

def load_document(file_path: str) -> str:
    """Load a text document."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def initialize_knowledge_base():
    """Initialize the knowledge base with documents."""
    print("Initializing knowledge base...")
    
    # Initialize services
    embedding_service = EmbeddingService()
    vector_store = VectorStore()
    
    # Clear existing collection
    print("Clearing existing collection...")
    vector_store.clear_collection()
    
    # Load documents
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    
    documents = []
    metadatas = []
    
    # Process resume
    print("Processing resume...")
    resume_path = os.path.join(data_dir, 'resume.txt')
    if os.path.exists(resume_path):
        resume_text = load_document(resume_path)
        resume_text = clean_text(resume_text)
        resume_chunks = chunk_text(resume_text, chunk_size=512, overlap=50)
        for i, chunk in enumerate(resume_chunks):
            documents.append(chunk)
            metadatas.append({"source": "resume", "chunk_index": i})
        print(f"  Added {len(resume_chunks)} resume chunks")
    
    # Process portfolio content
    print("Processing portfolio content...")
    portfolio_path = os.path.join(data_dir, 'portfolio_content.txt')
    if os.path.exists(portfolio_path):
        portfolio_text = load_document(portfolio_path)
        portfolio_text = clean_text(portfolio_text)
        portfolio_chunks = chunk_text(portfolio_text, chunk_size=512, overlap=50)
        for i, chunk in enumerate(portfolio_chunks):
            documents.append(chunk)
            metadatas.append({"source": "portfolio", "chunk_index": i})
        print(f"  Added {len(portfolio_chunks)} portfolio chunks")
    
    # Process projects
    print("Processing projects...")
    projects_path = os.path.join(data_dir, 'projects.json')
    if os.path.exists(projects_path):
        import json
        with open(projects_path, 'r', encoding='utf-8') as f:
            projects_data = json.load(f)
        
        for project in projects_data.get('projects', []):
            project_text = f"Project: {project.get('title', '')}\n"
            project_text += f"Description: {project.get('description', '')}\n"
            project_text += f"Technologies: {', '.join(project.get('technologies', []))}\n"
            project_text += f"Features: {'; '.join(project.get('features', []))}\n"
            
            project_text = clean_text(project_text)
            project_chunks = chunk_text(project_text, chunk_size=512, overlap=50)
            for i, chunk in enumerate(project_chunks):
                documents.append(chunk)
                metadatas.append({"source": "projects", "project": project.get('title', ''), "chunk_index": i})
        print(f"  Added project chunks")
    
    if not documents:
        print("No documents found to process!")
        return
    
    print(f"\nTotal chunks to process: {len(documents)}")
    print("Generating embeddings...")
    
    # Generate embeddings in batches
    batch_size = 100
    all_embeddings = []
    
    for i in range(0, len(documents), batch_size):
        batch = documents[i:i + batch_size]
        print(f"  Processing batch {i // batch_size + 1}/{(len(documents) - 1) // batch_size + 1}...")
        embeddings = embedding_service.generate_embeddings_batch(batch)
        all_embeddings.extend(embeddings)
    
    print("Adding documents to vector store...")
    
    # Generate IDs
    ids = [f"doc_{i}" for i in range(len(documents))]
    
    # Add to vector store
    vector_store.add_documents(
        texts=documents,
        embeddings=all_embeddings,
        metadatas=metadatas,
        ids=ids
    )
    
    print(f"\n✓ Knowledge base initialized successfully!")
    print(f"  Total documents: {len(documents)}")
    print(f"  Collection count: {vector_store.get_collection_count()}")

if __name__ == "__main__":
    try:
        initialize_knowledge_base()
    except Exception as e:
        print(f"Error initializing knowledge base: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

