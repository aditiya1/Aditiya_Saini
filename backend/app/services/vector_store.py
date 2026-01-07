import os
import chromadb
from chromadb.config import Settings
from typing import List, Dict, Tuple
import json

class VectorStore:
    def __init__(self, persist_directory: str = "./chroma_db"):
        """Initialize ChromaDB vector store."""
        self.persist_directory = persist_directory
        self.client = chromadb.PersistentClient(
            path=persist_directory,
            settings=Settings(anonymized_telemetry=False)
        )
        self.collection = self.client.get_or_create_collection(
            name="portfolio_knowledge",
            metadata={"hnsw:space": "cosine"}
        )
    
    def add_documents(self, texts: List[str], embeddings: List[List[float]], 
                     metadatas: List[Dict] = None, ids: List[str] = None):
        """Add documents to the vector store."""
        if metadatas is None:
            metadatas = [{}] * len(texts)
        if ids is None:
            ids = [f"doc_{i}" for i in range(len(texts))]
        
        self.collection.add(
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas,
            ids=ids
        )
    
    def search(self, query_embedding: List[float], n_results: int = 5) -> List[Dict]:
        """
        Search for similar documents.
        
        Returns:
            List of dictionaries with 'document', 'metadata', 'distance' keys
        """
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        
        # Format results
        formatted_results = []
        if results['documents'] and len(results['documents'][0]) > 0:
            for i in range(len(results['documents'][0])):
                formatted_results.append({
                    'document': results['documents'][0][i],
                    'metadata': results['metadatas'][0][i] if results['metadatas'] else {},
                    'distance': results['distances'][0][i] if results['distances'] else 0.0
                })
        
        return formatted_results
    
    def get_collection_count(self) -> int:
        """Get the number of documents in the collection."""
        return self.collection.count()
    
    def clear_collection(self):
        """Clear all documents from the collection."""
        self.client.delete_collection(name="portfolio_knowledge")
        self.collection = self.client.get_or_create_collection(
            name="portfolio_knowledge",
            metadata={"hnsw:space": "cosine"}
        )

