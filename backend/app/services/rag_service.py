import os
from openai import OpenAI
from typing import List, Dict
from .embedding_service import EmbeddingService
from .vector_store import VectorStore

class RAGService:
    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.vector_store = VectorStore()
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
        self.client = OpenAI(api_key=api_key)
        self.model = "gpt-4o-mini"  # GPT-4.1 nano - cost-effective and fast
    
    def retrieve_context(self, query: str, top_k: int = 3) -> str:
        """Retrieve relevant context from the knowledge base."""
        # Generate embedding for query
        query_embedding = self.embedding_service.generate_embedding(query)
        
        # Search vector store
        results = self.vector_store.search(query_embedding, n_results=top_k)
        
        # Combine retrieved documents
        context_parts = []
        for result in results:
            context_parts.append(result['document'])
        
        return "\n\n".join(context_parts)
    
    def generate_response(self, query: str, context: str) -> str:
        """Generate response using OpenAI with retrieved context."""
        system_prompt = """You are a helpful AI assistant for Aditiya Saini's portfolio website. 
Your role is to answer questions about Adi's professional background, projects, skills, experience, and contact information.

Guidelines:
- Be friendly, professional, and concise
- Only answer questions based on the provided context
- If the context doesn't contain relevant information, politely say you don't have that information
- Focus on accuracy and helpfulness
- When mentioning projects or experience, be specific and highlight key achievements
- For contact information, provide clear and accurate details"""

        user_prompt = f"""Context from Adi's portfolio:
{context}

User Question: {query}

Please provide a helpful answer based on the context above. If the context doesn't contain enough information to answer the question, politely let the user know."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            raise Exception(f"Error generating response: {str(e)}")
    
    def query(self, user_query: str) -> str:
        """Main method to process a user query using RAG."""
        # Retrieve relevant context
        context = self.retrieve_context(user_query)
        
        # Generate response
        response = self.generate_response(user_query, context)
        
        return response

