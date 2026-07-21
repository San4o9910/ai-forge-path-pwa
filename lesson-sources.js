const LESSON_SOURCES = {
  "python_tutorial": {
    "title": "The Python Tutorial",
    "publisher": "Python Software Foundation",
    "url": "https://docs.python.org/3/tutorial/"
  },
  "python_data": {
    "title": "Data Structures — Python Tutorial",
    "publisher": "Python Software Foundation",
    "url": "https://docs.python.org/3/tutorial/datastructures.html"
  },
  "python_control": {
    "title": "More Control Flow Tools",
    "publisher": "Python Software Foundation",
    "url": "https://docs.python.org/3/tutorial/controlflow.html"
  },
  "python_classes": {
    "title": "Classes — Python Tutorial",
    "publisher": "Python Software Foundation",
    "url": "https://docs.python.org/3/tutorial/classes.html"
  },
  "python_errors": {
    "title": "Errors and Exceptions",
    "publisher": "Python Software Foundation",
    "url": "https://docs.python.org/3/tutorial/errors.html"
  },
  "python_io": {
    "title": "Input and Output",
    "publisher": "Python Software Foundation",
    "url": "https://docs.python.org/3/tutorial/inputoutput.html"
  },
  "python_modules": {
    "title": "Modules — Python Tutorial",
    "publisher": "Python Software Foundation",
    "url": "https://docs.python.org/3/tutorial/modules.html"
  },
  "python_venv": {
    "title": "Virtual Environments and Packages",
    "publisher": "Python Software Foundation",
    "url": "https://docs.python.org/3/tutorial/venv.html"
  },
  "numpy": {
    "title": "NumPy Fundamentals",
    "publisher": "NumPy",
    "url": "https://numpy.org/doc/stable/user/basics.html"
  },
  "pandas": {
    "title": "pandas User Guide",
    "publisher": "pandas",
    "url": "https://pandas.pydata.org/docs/user_guide/"
  },
  "matplotlib": {
    "title": "Matplotlib Quick Start",
    "publisher": "Matplotlib",
    "url": "https://matplotlib.org/stable/users/explain/quick_start.html"
  },
  "sklearn": {
    "title": "scikit-learn User Guide",
    "publisher": "scikit-learn",
    "url": "https://scikit-learn.org/stable/user_guide.html"
  },
  "sklearn_pitfalls": {
    "title": "Common pitfalls and recommended practices",
    "publisher": "scikit-learn",
    "url": "https://scikit-learn.org/stable/common_pitfalls.html"
  },
  "google_ml": {
    "title": "Machine Learning Crash Course",
    "publisher": "Google for Developers",
    "url": "https://developers.google.com/machine-learning/crash-course"
  },
  "dlbook": {
    "title": "Deep Learning",
    "publisher": "MIT Press",
    "url": "https://www.deeplearningbook.org/"
  },
  "attention": {
    "title": "Attention Is All You Need",
    "publisher": "arXiv",
    "url": "https://arxiv.org/abs/1706.03762"
  },
  "openai_prompt": {
    "title": "Prompt engineering best practices",
    "publisher": "OpenAI",
    "url": "https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api"
  },
  "openai_tokens": {
    "title": "Tokenizer",
    "publisher": "OpenAI",
    "url": "https://platform.openai.com/tokenizer"
  },
  "openai_embeddings": {
    "title": "Embeddings FAQ",
    "publisher": "OpenAI",
    "url": "https://help.openai.com/en/articles/6824809-embeddings-faq"
  },
  "openai_function": {
    "title": "Function Calling in the OpenAI API",
    "publisher": "OpenAI",
    "url": "https://help.openai.com/en/articles/8555517-function-calling-in-the-openai-api"
  },
  "openai_agents": {
    "title": "A practical guide to building AI agents",
    "publisher": "OpenAI",
    "url": "https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/"
  },
  "rag_paper": {
    "title": "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
    "publisher": "arXiv",
    "url": "https://arxiv.org/abs/2005.11401"
  },
  "react_paper": {
    "title": "ReAct: Synergizing Reasoning and Acting in Language Models",
    "publisher": "arXiv",
    "url": "https://arxiv.org/abs/2210.03629"
  },
  "langchain": {
    "title": "LangChain overview",
    "publisher": "LangChain",
    "url": "https://docs.langchain.com/oss/python/langchain/overview"
  },
  "langgraph": {
    "title": "LangGraph overview",
    "publisher": "LangChain",
    "url": "https://docs.langchain.com/oss/python/langgraph/overview"
  },
  "langgraph_graph": {
    "title": "LangGraph Graph API",
    "publisher": "LangChain",
    "url": "https://docs.langchain.com/oss/python/langgraph/graph-api"
  },
  "llamaindex": {
    "title": "LlamaIndex documentation",
    "publisher": "LlamaIndex",
    "url": "https://developers.llamaindex.ai/python/framework/"
  },
  "crewai": {
    "title": "CrewAI documentation",
    "publisher": "CrewAI",
    "url": "https://docs.crewai.com/"
  },
  "fastapi": {
    "title": "FastAPI Tutorial",
    "publisher": "FastAPI",
    "url": "https://fastapi.tiangolo.com/tutorial/"
  },
  "http_rfc": {
    "title": "HTTP Semantics — RFC 9110",
    "publisher": "IETF",
    "url": "https://www.rfc-editor.org/rfc/rfc9110"
  },
  "oauth": {
    "title": "OAuth 2.0 Authorization Framework — RFC 6749",
    "publisher": "IETF",
    "url": "https://www.rfc-editor.org/rfc/rfc6749"
  },
  "jwt": {
    "title": "JSON Web Token — RFC 7519",
    "publisher": "IETF",
    "url": "https://www.rfc-editor.org/rfc/rfc7519"
  },
  "postgres": {
    "title": "PostgreSQL Documentation",
    "publisher": "PostgreSQL Global Development Group",
    "url": "https://www.postgresql.org/docs/current/"
  },
  "docker": {
    "title": "Docker Get Started",
    "publisher": "Docker",
    "url": "https://docs.docker.com/get-started/"
  },
  "github_git": {
    "title": "About Git",
    "publisher": "GitHub Docs",
    "url": "https://docs.github.com/en/get-started/using-git/about-git"
  },
  "github_actions": {
    "title": "GitHub Actions documentation",
    "publisher": "GitHub Docs",
    "url": "https://docs.github.com/en/actions"
  },
  "aws_arch": {
    "title": "AWS Well-Architected Framework",
    "publisher": "Amazon Web Services",
    "url": "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html"
  },
  "azure_arch": {
    "title": "Azure Architecture Center",
    "publisher": "Microsoft",
    "url": "https://learn.microsoft.com/azure/architecture/"
  },
  "gcp_arch": {
    "title": "Google Cloud Architecture Framework",
    "publisher": "Google Cloud",
    "url": "https://cloud.google.com/architecture/framework"
  },
  "otel": {
    "title": "OpenTelemetry Documentation",
    "publisher": "OpenTelemetry",
    "url": "https://opentelemetry.io/docs/"
  }
};
const LESSONS = {};
