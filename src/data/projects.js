import chatbotLogo from '../assets/chatbot-logo.png';
import tradieInvoicingImg from '../assets/tradie-invoicing.jpg';

export const projects = [
  {
    id: 'tradie-invoicing',
    title: 'Job Pack — Invoicing for Australian Tradies',
    shortDescription: 'A multi-tenant invoicing platform for Australian sole traders — set up your business once, then raise a compliant tax invoice and email it as a PDF in minutes.',
    fullDescription: 'I built a full-stack invoicing tool for Australian tradies (electricians, plumbers, builders) who need to send compliant tax invoices without wrestling with generic templates. ABNs are validated against the ATO\'s real weighted-modulus-89 checksum rather than a naive digit count, and every generated PDF carries the fields the ATO requires for a valid tax invoice — "Tax Invoice," the seller\'s ABN, a sequential invoice number, and GST per line. Invoice numbers increment per business inside a database transaction, so concurrent invoices can never collide.',
    image: tradieInvoicingImg,
    technologies: [
      'Next.js (App Router)',
      'TypeScript',
      'PostgreSQL (Supabase)',
      'Prisma',
      'Auth.js',
      'Resend',
      '@react-pdf/renderer',
      'Tailwind CSS'
    ],
    githubUrl: 'https://github.com/aditiya1/tradie-invoicing',
    features: [
      'ABN validation against the ATO\'s real weighted-modulus-89 checksum',
      'Multi-tenant data model — every query scoped by business, isolation built into the schema',
      'Customer CRUD, editable at any time',
      'Invoice builder with line items and live GST/total calculation',
      'Four selectable PDF invoice templates, each still lets you add or remove custom fields',
      'Server-rendered, ATO-compliant tax invoice PDFs via @react-pdf/renderer',
      'Email delivery via Resend, with per-invoice sent/delivered status shown in the dashboard',
      'Business, customer, and invoice details all editable before an invoice is sent',
      'Atomic, per-business sequential invoice numbering — safe under concurrent requests',
      'Auth.js email magic-link authentication, no passwords to manage'
    ]
  },
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
  },
  {
    id: 'task-manager',
    title: 'Task Manager',
    shortDescription: 'A robust task manager built with ASP.NET Core Web API and Blazor, featuring full CRUD operations, filtering, and real-time updates.',
    fullDescription: 'I built a full-stack task manager application using ASP.NET Core Web API for the backend and Blazor Server for the frontend. The API provides RESTful endpoints for task management with Entity Framework Core and SQLite for persistence. The Blazor frontend offers a responsive UI with create, read, update, and delete operations, along with search and filter capabilities by status and priority. Tasks support multiple statuses (To Do, In Progress, Done, Cancelled) and priorities (Low, Medium, High, Urgent), with due date tracking and completion timestamps.',
    image: null,
    technologies: [
      'C#',
      'ASP.NET Core',
      'Blazor',
      'Entity Framework Core',
      'SQLite',
      'REST API',
      'Bootstrap'
    ],
    githubUrl: 'https://github.com/Adi1-git',
    liveUrl: "https://task-manager-blazor.onrender.com",
    features: [
      'Full CRUD operations for tasks',
      'Task status workflow (To Do, In Progress, Done, Cancelled)',
      'Priority levels (Low, Medium, High, Urgent)',
      'Search and filter by status and priority',
      'Due date and completion tracking',
      'RESTful API with OpenAPI documentation',
      'Blazor Server interactive UI',
      'SQLite database with EF Core'
    ]
  }
];

