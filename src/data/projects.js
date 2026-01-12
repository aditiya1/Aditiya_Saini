import chatbotLogo from '../assets/chatbot-logo.png';

export const projects = [
  {
    id: 'ai-chatbot-rag',
    title: 'AI Chatbot with RAG Pipeline',
    shortDescription: 'An intelligent chatbot powered by Retrieval-Augmented Generation that answers questions about my portfolio, projects, resume, and contact information.',
    fullDescription: 'I built a sophisticated AI-powered chatbot system using Retrieval-Augmented Generation (RAG) to provide accurate, context-aware responses about my professional background. The system uses semantic search to retrieve relevant information from my knowledge base (resume, project descriptions, portfolio content) and generates natural language responses using OpenAI\'s GPT models. This project demonstrates my expertise in AI/ML integration, vector databases, and full-stack development.',
    image: chatbotLogo,
    technologies: [
      'React',
      'Python',
      'FastAPI',
      'OpenAI API',
      'ChromaDB',
      'Vector Embeddings',
      'RAG',
      'Semantic Search',
      'Docker'
    ],
    githubUrl: 'https://github.com/Adi1-git',
    liveUrl: 'https://aditiya1.github.io/Aditiya_Saini',
    features: [
      'Semantic search using vector embeddings for accurate information retrieval',
      'RAG pipeline with document chunking and embedding generation',
      'Real-time chat interface with smooth animations',
      'Context-aware responses about projects, experience, and contact info',
      'Vector database integration for efficient similarity search',
      'RESTful API with FastAPI for scalable backend',
      'Responsive design with modern UI/UX',
      'Error handling and graceful degradation'
    ]
  }
];

