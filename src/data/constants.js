/**
 * Single source of truth for portfolio content.
 * Rebuilt from Ashish_Resume_sept.pdf — the resume is authoritative.
 */

export const Bio = {
  name: "Ashish Maurya",
  title: "AI & Backend Engineer",
  location: "Ghaziabad, India",
  // Middots rather than slashes as separators: "AI/ML / Backend / SDE" reads
  // as one four-way list because the slash is doing two different jobs.
  availability: "Open to AI/ML · Backend · SDE roles",
  roles: [
    "AI & Backend Engineer",
    "Backend Engineer",
    "Agent Harness Engineer",
    "Software Developer",
  ],
  tagline: "I build the harness around autonomous agents, and the backend that keeps them cheap.",
  description:
    "AI & Backend Engineer at Cognio Labs. I build the harness that lets agents run long and stay correct — a persistent virtual filesystem, a verify-then-self-repair loop with progressive context loading, and a guardrail layer that cut invalid agent output by 30%. Most of my work sits underneath that: Postgres job queues, auto-scaled worker pools, and the distributed systems that keep it affordable at scale.",
  github: "https://github.com/ashishmaurya57",
  resume:
    "https://drive.google.com/file/d/1NxS50Bloj2pa91jS3soC7kEF8XjPLFvT/view?usp=sharing",
  linkedin: "https://www.linkedin.com/in/ashish-maurya-iet-student-419788232/",
  insta: "https://www.instagram.com/ashishmauryaam57/",
  email: "ashishmauryaam57@gmail.com",
  Contact: "+919517009645",
};

/**
 * Headline numbers. Every one is a personal outcome ("I cut / I lifted"), not a
 * product spec — "50+ LLMs routed" and "16 artifact types" read like a product
 * pitch on a personal hero, not an accomplishment, so they live on the Druidix
 * project card instead, where that framing is correct.
 */
export const metrics = [
  { value: "36", suffix: "%", label: "Faster API response", detail: "500ms → 320ms at Hashedbit" },
  { value: "30", suffix: "%", label: "Fewer invalid agent outputs", detail: "Guardrail + eval harness" },
  { value: "27", suffix: "%", label: "Higher RAG relevance", detail: "Hybrid BM25 + dense on Qdrant" },
  { value: "400", suffix: "+", label: "DSA problems solved", detail: "LeetCode Knight — peak 1869" },
];

/* ------------------------------------------------------------------ *
 * Agent harness — long-form content, published on the Blog, not the
 * home page. Grounded in the Sept resume's Druidix bullets; anything
 * beyond that (like the walk-through framing) is presented as how the
 * system behaves, not as an additional resume claim.
 * ------------------------------------------------------------------ */

/**
 * Blog index. One entry per post — each `slug` must match a page route
 * (`/blog/:slug`) wired up in App.js. Add future posts here; the list page
 * needs nothing else to pick them up.
 */
export const blogPosts = [
  {
    slug: "engineering-the-agent-harness",
    title: "Engineering the agent harness",
    excerpt:
      "A persistent virtual filesystem, a verify-then-self-repair loop, and the guardrail layer that cut invalid agent output by 30% — how Druidix's harness actually works.",
    tag: "Architecture",
    readTime: "9 min read",
    updated: "September 2025",
  },
];

export const harness = {
  slug: "engineering-the-agent-harness",
  title: "Engineering the agent harness",
  dek: "Druidix · Cognio Labs",
  readTime: "9 min read",
  updated: "September 2025",
  intro:
    "Most agent demos die on the second tool call. The harness behind Druidix is the part that makes long-horizon work actually finish: a persistent virtual filesystem so an agent has real state, a verify-then-self-repair loop with progressive context loading so it can recover mid-task, and a middleware guardrail layer that cut invalid or failed agent output by 30%. None of that is one feature — it's the plumbing underneath everything Druidix does.",
  points: [
    {
      id: "filesystem",
      title: "A persistent virtual filesystem, not a scratch buffer",
      icon: "TbBoxMultiple",
      body:
        "The computer-use agent doesn't just emit text — it writes to a persistent virtual filesystem with per-artifact metadata, running inside isolated E2B and Vercel sandboxes. That's what makes 16 distinct artifact types (PDFs, slides, docs, and more) possible from one agent: the filesystem is the shared surface every step reads and writes against, so a later step can reference what an earlier one produced without re-deriving it.",
      value:
        "An agent that can only hold context in its prompt forgets what it built two steps ago. One with real file state can reference, revise and compose its own prior output — which is the difference between generating a document and generating a project.",
      guardrails: [
        "Full sandbox isolation from the host",
        "Per-artifact metadata for traceability",
        "16 artifact types from one dispatch surface",
      ],
      tags: ["E2B", "Vercel Sandbox", "Virtual filesystem", "Computer-use agent"],
    },
    {
      id: "repair",
      title: "Verify, then self-repair, on a context budget",
      icon: "TbAdjustmentsBolt",
      body:
        "Every run passes through a verify step before it's accepted, and a failed verification routes into self-repair rather than aborting. Context is loaded progressively rather than stuffed up front, so a long-running task doesn't drag its entire history into every step. Wrapping the whole loop is a middleware guardrail layer — token-budget limits plus an automated eval harness — that measurably cut invalid or failed agent output by 30%.",
      value:
        "That 30% isn't a benchmark number, it's fewer runs a human has to babysit. The guardrail layer is what makes it safe to let the loop retry on its own instead of surfacing every failure to a person.",
      guardrails: [
        "Token-budget ceiling enforced per step",
        "Automated eval harness gates acceptance",
        "Progressive context — no full-history replay",
      ],
      tags: ["Verify / self-repair", "Progressive context", "Eval harness", "Token budget"],
    },
    {
      id: "provisioning",
      title: "Vertical-agent provisioning under a supervisor",
      icon: "TbTopologyStar3",
      body:
        "Onboarding a business auto-assigns it a set of specialised sub-agents by vertical — an SEO agent, a lead-generation agent, and others — all running and inter-communicating autonomously under a supervisor orchestrator agent. The supervisor is what enforces guardrails and validation checks across the group, so specialised agents can act independently without the platform losing a single point of control.",
      value:
        "A business doesn't get one generic agent that's mediocre at everything — it gets several narrow agents that are good at one thing, coordinated by a supervisor instead of coordinating each other directly.",
      guardrails: [
        "Supervisor-enforced validation checks",
        "Per-vertical sub-agent isolation",
        "Autonomous inter-agent communication, governed centrally",
      ],
      tags: ["Supervisor orchestrator", "Sub-agents", "Guardrails", "Validation"],
    },
    {
      id: "queue",
      title: "A job queue built to survive its own scale",
      icon: "TbServerBolt",
      body:
        "Underneath the agent layer is a horizontally scalable Postgres job queue — SKIP LOCKED claiming, lease and heartbeat re-claim, idempotent dedupe keys — delivering at-least-once delivery with exactly-once effects. Worker pools are auto-scaled, rate-limited, and split by job type: document processing, embeddings, Telegram/Slack channel adapters, and cron-triggered agent runs each get their own pool, with Prometheus and LangSmith observability plus SSE token streaming on top.",
      value:
        "Splitting worker pools by job type means an embeddings backlog never starves a Slack adapter, and a stalled worker's job gets reclaimed by heartbeat instead of silently disappearing — the platform degrades gracefully instead of falling over.",
      guardrails: [
        "SKIP LOCKED claiming — no two workers grab the same job",
        "Lease + heartbeat re-claim on stalled workers",
        "Idempotent dedupe keys for exactly-once effects",
      ],
      tags: ["PostgreSQL", "SKIP LOCKED", "Worker pools", "Prometheus", "LangSmith", "SSE"],
    },
    {
      id: "retrieval",
      title: "Hybrid retrieval where dense-only search fails",
      icon: "TbSearch",
      body:
        "For keyword and identifier queries — where dense-only retrieval tends to confuse near-duplicate documents — Druidix fuses BM25/SPLADE sparse signals with dense vectors via reciprocal rank fusion on Qdrant. That single change lifted retrieval relevance by 27% on exactly the query class where pure embedding search struggles.",
      value:
        "Semantic search is great at 'documents about X' and bad at 'the document with this exact identifier in it.' Hybrid fusion means the harness doesn't have to choose — it gets both.",
      guardrails: ["Sparse + dense fusion, not either/or", "Tuned specifically for identifier queries"],
      tags: ["Hybrid RAG", "BM25 / SPLADE", "RRF", "Qdrant"],
    },
  ],

  /**
   * A representative trace of one computer-use run, showing the loop
   * recovering from a failure. Illustrative of the control flow described
   * above — not a captured production log.
   */
  log: {
    caption: "Representative run — how the loop behaves when a step fails",
    meta: [
      ["mode", "computer-use"],
      ["fs", "virtual (per-run)"],
      ["budget", "72% of ceiling"],
      ["eval", "passed"],
    ],
    rows: [
      { t: "00.0s", node: "plan", detail: "decompose objective → 6 steps", status: "ok" },
      { t: "00.4s", node: "retrieve", detail: "BM25 + dense → RRF → 9 chunks (qdrant)", status: "ok" },
      { t: "01.1s", node: "fs.write", detail: "artifact/draft.md created — metadata attached", status: "ok" },
      { t: "03.6s", node: "sandbox", detail: "e2b.spawn · lease 120s · heartbeat 10s", status: "ok" },
      { t: "08.9s", node: "sandbox", detail: "render slides → exit 1 · missing asset", status: "fail" },
      { t: "09.0s", node: "verify", detail: "eval harness rejected output → self-repair", status: "warn" },
      { t: "10.4s", node: "repair", detail: "fetch asset · progressive context reload", status: "ok" },
      { t: "16.8s", node: "sandbox", detail: "render slides → exit 0 · artifact emitted", status: "ok" },
      { t: "17.1s", node: "fs.write", detail: "artifact/deck.pdf linked to draft.md", status: "ok" },
      { t: "17.4s", node: "guard", detail: "token budget 72% of ceiling → within limit", status: "ok" },
      { t: "17.6s", node: "done", detail: "run committed · queue job marked complete", status: "ok" },
    ],
  },
};

/* ------------------------------------------------------------------ *
 * Capability pillars — deliberately kept generic. The literal Druidix
 * implementation detail (SKIP LOCKED, GDPR/Fernet, etc.) lives in
 * Experience and the Blog; this section answers "what would you hire
 * him to do", not "what did he build at one company".
 * ------------------------------------------------------------------ */

export const focusAreas = [
  {
    id: "harness",
    title: "Agent Harnessing",
    icon: "TbShieldBolt",
    description:
      "The control loop around a model, not the model itself: a verify-then-self-repair cycle, progressive context loading so long tasks don't drag their full history along, and a guardrail layer that measurably cuts invalid or failed output rather than just hoping the prompt is good enough.",
    stack: ["LangGraph", "Guardrails", "Eval harness", "Sandboxes", "MCP"],
  },
  {
    id: "backend",
    title: "Distributed Backends",
    icon: "TbServerBolt",
    description:
      "Horizontally scalable job queues and auto-scaled worker pools tuned for at-least-once delivery with exactly-once effects — the kind of infrastructure built to hold up long after the demo ends, not just to pass a load test once.",
    stack: ["FastAPI", "PostgreSQL", "Redis", "Worker pools", "Prometheus"],
  },
  {
    id: "retrieval",
    title: "Retrieval & RAG",
    icon: "TbSearch",
    description:
      "Hybrid retrieval fusing BM25/SPLADE sparse signals with dense vectors through reciprocal rank fusion — built for the query class where pure semantic search fails: exact identifiers, near-duplicate documents, and structured domains like financial or banking records where the exact match matters as much as the meaning.",
    stack: ["Qdrant", "BM25 / SPLADE", "RRF", "Vector Search"],
  },
  {
    id: "cloud",
    title: "Cloud & Delivery",
    icon: "TbCloudCog",
    description:
      "Multi-service systems on GCP with Terraform IaC and GitHub Actions CI, instrumented with Prometheus and Grafana so a production incident shows up on a dashboard, not from a user's complaint.",
    stack: ["GCP", "Docker", "Terraform", "GitHub Actions", "Grafana"],
  },
];

/* ------------------------------------------------------------------ *
 * Experience
 * ------------------------------------------------------------------ */

export const experiences = [
  {
    id: 0,
    role: "AI & Backend Engineer",
    company: "Cognio Labs",
    date: "July 2025 — Present",
    summary:
      "Own the agent harness and the distributed backend beneath it, across two production products.",
    projects: [
      {
        name: "Druidix — Agentic AI Platform",
        bullets: [
          "Built the agentic harness behind Druidix's autonomous computer-use agent: a persistent virtual filesystem with per-artifact metadata generating 16 artifact types (PDFs, slides, docs) in isolated E2B/Vercel sandboxes.",
          "Designed a verify → self-repair loop with progressive context loading, wrapped in a middleware guardrail layer (token-budget limits, automated eval harness) that cut invalid/failed agent output by 30%.",
          "Shipped a vertical-agent provisioning flow — business-type onboarding auto-assigns specialised sub-agents (SEO, lead generation) that run and inter-communicate autonomously under a supervisor orchestrator agent, with guardrails and validation checks.",
          "Engineered a horizontally scalable Postgres job queue (SKIP LOCKED claiming, lease/heartbeat re-claim, idempotent dedupe keys) delivering at-least-once delivery with exactly-once effects across auto-scaled, rate-limited worker pools split by job type (doc-processing, embeddings, Telegram/Slack channel adapters, cron-triggered agent runs); added Prometheus + LangSmith observability and SSE token streaming.",
          "Implemented hybrid RAG (BM25/SPLADE sparse fused with dense via RRF on Qdrant), lifting relevance by 27% on keyword/identifier queries where dense-only retrieval confused near-duplicate documents.",
        ],
      },
      {
        name: "Storyform / Be-Olivia — AI Jewellery Design Platform",
        bullets: [
          "Architected the production 3-service system (Express + TypeScript, FastAPI, React) on GCP Cloud Run with Terraform IaC and GitHub Actions CI; independently designed GDPR-aligned backend security (encryption, access control, data minimisation).",
          "Built a text/image → 3D mesh pipeline using Gemini and Tripo3D with a Trimesh-based DFM validator, hitting a 97.7% manufacturability pass rate; Node API on Prisma/PostgreSQL, Redis, better-auth, Stripe and GCS signed URLs.",
        ],
      },
    ],
    skills: [
      "Python",
      "TypeScript",
      "FastAPI",
      "LangGraph",
      "LangChain",
      "LangSmith",
      "PostgreSQL",
      "Qdrant",
      "Redis",
      "E2B Sandbox",
      "GCP",
      "Terraform",
      "Prometheus",
      "Stripe",
    ],
  },
  {
    id: 1,
    role: "Software Development Intern",
    company: "Hashedbit Innovations",
    date: "June 2024 — Sept 2024",
    summary: "Full-stack product work across the React front end and the Node API layer.",
    projects: [
      {
        name: null,
        bullets: [
          "Engineered responsive UI components with React.js, HTML, CSS and JavaScript, reducing page load time by 28% and improving engagement for 1,000+ users.",
          "Redesigned CRUD APIs with Node.js and Express.js; optimised SQL queries and indexing to cut average API response time by 36% (500ms → 320ms).",
        ],
      },
    ],
    skills: ["React.js", "Node.js", "Express.js", "JavaScript", "HTML", "CSS", "SQL"],
    doc: "https://drive.google.com/file/d/1Q6l-CuH0VBkHkjfgwOHjLWbstiqjEasm/view",
  },
];

/* ------------------------------------------------------------------ *
 * Skills — rebuilt to match the Sept resume's SKILLS section exactly,
 * plus a Frontend group (React/HTML/CSS/Tailwind) added on top since the
 * resume's condensed skill list omits it even though the Hashedbit and
 * personal-project work below both use it.
 * ------------------------------------------------------------------ */

export const skills = [
  {
    title: "Agentic AI & LLM Tooling",
    icon: "TbRobot",
    note: "Planning, tool use, harness",
    skills: [
      { name: "LangChain", icon: "TbLink" },
      { name: "LangGraph", icon: "TbBinaryTree" },
      { name: "LangSmith", icon: "TbHammer" },
      { name: "HuggingFace", icon: "TbRobot" },
      { name: "Prompt Engineering", icon: "TbBulb" },
      { name: "Agentic AI", icon: "TbTopologyStar3" },
      { name: "MCP", icon: "TbPlugConnected" },
      { name: "Tool Calling", icon: "TbTool" },
      { name: "Computer-Use Agents", icon: "TbCursorText" },
      { name: "Sandboxes", icon: "TbBoxMultiple" },
    ],
  },
  {
    title: "Machine Learning",
    icon: "TbBrain",
    note: "Models, features, evaluation",
    skills: [
      { name: "PyTorch", icon: "SiPytorch" },
      { name: "TensorFlow", icon: "SiTensorflow" },
      { name: "scikit-learn", icon: "SiScikitlearn" },
      { name: "NumPy", icon: "SiNumpy" },
      { name: "Pandas", icon: "SiPandas" },
      { name: "Transformers / BERT", icon: "TbAbc" },
      { name: "Transfer Learning", icon: "TbTransform" },
      { name: "Gradient Boosting", icon: "TbChartHistogram" },
      { name: "Fine-tuning (LoRA/PEFT)", icon: "TbAdjustmentsBolt" },
      { name: "Feature Engineering", icon: "TbTable" },
      { name: "Model Evaluation", icon: "TbTargetArrow" },
      { name: "MLflow", icon: "SiMlflow" },
    ],
  },
  {
    title: "Retrieval & Voice",
    icon: "TbSearch",
    note: "Hybrid search and speech",
    skills: [
      { name: "Hybrid RAG", icon: "TbLayersIntersect" },
      { name: "BM25", icon: "TbMathFunction" },
      { name: "SPLADE", icon: "TbMathFunction" },
      { name: "RRF", icon: "TbSortAscending" },
      { name: "Vector Search", icon: "TbVectorTriangle" },
      { name: "STT", icon: "TbMicrophone" },
      { name: "TTS", icon: "TbVolume" },
    ],
  },
  {
    title: "Backend & API",
    icon: "TbServerBolt",
    note: "Services and contracts",
    skills: [
      { name: "FastAPI", icon: "SiFastapi" },
      { name: "Node.js", icon: "SiNodedotjs" },
      { name: "Express", icon: "SiExpress" },
      { name: "Prisma ORM", icon: "SiPrisma" },
      { name: "Pydantic", icon: "TbShieldCheck" },
      { name: "REST APIs", icon: "TbApi" },
      { name: "gRPC", icon: "TbApi" },
      { name: "WebSocket", icon: "TbBroadcast" },
      { name: "High-Level Design", icon: "TbSitemap" },
    ],
  },
  {
    title: "Frontend",
    icon: "SiReact",
    note: "Interfaces over the API",
    skills: [
      { name: "React.js", icon: "SiReact" },
      { name: "HTML5", icon: "SiHtml5" },
      { name: "CSS3", icon: "SiCss3" },
      { name: "Tailwind CSS", icon: "SiTailwindcss" },
    ],
  },
  {
    title: "Databases",
    icon: "TbDatabase",
    note: "Relational, cache, vector",
    skills: [
      { name: "PostgreSQL", icon: "SiPostgresql" },
      { name: "MongoDB", icon: "SiMongodb" },
      { name: "MySQL", icon: "SiMysql" },
      { name: "Redis", icon: "SiRedis" },
      { name: "Qdrant", icon: "TbDatabase" },
    ],
  },
  {
    title: "Cloud & DevOps",
    icon: "TbCloudCog",
    note: "Ship, scale, observe",
    skills: [
      { name: "GCP", icon: "SiGooglecloud" },
      { name: "Docker", icon: "SiDocker" },
      { name: "Terraform", icon: "SiTerraform" },
      { name: "GitHub Actions", icon: "SiGithubactions" },
      { name: "Grafana", icon: "SiGrafana" },
      { name: "Prometheus", icon: "SiPrometheus" },
      { name: "Kafka", icon: "SiApachekafka" },
      { name: "Kubernetes", icon: "SiKubernetes" },
    ],
  },
  {
    title: "Auth & Payments",
    icon: "TbShieldLock",
    note: "Identity and billing",
    skills: [
      { name: "Better-Auth", icon: "TbShieldLock" },
      { name: "OAuth", icon: "TbKey" },
      { name: "JWT", icon: "SiJsonwebtokens" },
      { name: "Stripe", icon: "SiStripe" },
    ],
  },
  {
    title: "Languages",
    icon: "TbCode",
    note: "Written day to day",
    skills: [
      { name: "Python", icon: "SiPython" },
      { name: "TypeScript", icon: "SiTypescript" },
      { name: "JavaScript", icon: "SiJavascript" },
      { name: "C++", icon: "SiCplusplus" },
      { name: "SQL", icon: "TbDatabaseSearch" },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Projects
 * ------------------------------------------------------------------ */

export const projects = [
  {
    id: 1,
    title: "Druidix — Agentic AI Platform",
    date: "2025",
    featured: true,
    description:
      "The agentic harness behind an autonomous computer-use agent: a persistent virtual filesystem generating 16 artifact types in isolated sandboxes, a verify-then-self-repair loop that cut invalid output by 30%, vertical-agent provisioning under a supervisor orchestrator, and a horizontally scalable job queue with worker pools split by job type. Hybrid RAG lifts retrieval relevance 27% on keyword and identifier queries.",
    image: process.env.PUBLIC_URL + "/images/projects/druidix.jpg",
    category: "AI/ML",
    webapp: "https://druidix.co",
    tags: ["LangGraph", "E2B Sandbox", "Hybrid RAG", "Qdrant", "PostgreSQL", "Vertical agents"],
  },
  {
    id: 3,
    title: "VidyaLabs — AI EdTech Platform",
    date: "2025",
    featured: true,
    description:
      "A multilingual voice assistant on a LangGraph-orchestrated agent with an intent-routing node that sends each query to the right sub-flow — hybrid RAG retrieval, direct Q&A, or automatic web search — backed by a stateful memory layer that keeps context coherent across multi-turn tutoring. Teachers auto-generate curriculum-aligned assessments and worksheets via hybrid RAG, cutting content-prep time by 15%, and an auto-weakness-detection pipeline drives personalised tutoring.",
    image: process.env.PUBLIC_URL + "/images/projects/vidyalabs.jpg",
    category: "AI/ML",
    webapp: "https://vidyalabs.org/",
    tags: ["LangGraph", "Hybrid RAG", "Voice Agent", "Intent Routing", "Memory"],
  },
  {
    id: 2,
    title: "Storyform / Be-Olivia — AI Jewellery Design",
    date: "2025",
    featured: true,
    description:
      "Production 3-service system (Express + TypeScript, FastAPI, React) on GCP Cloud Run with Terraform IaC and GitHub Actions CI. Text and image inputs run through a Gemini and Tripo3D pipeline into 3D meshes, validated for manufacturability by a Trimesh-based DFM checker at a 97.7% pass rate. GDPR-aligned security throughout.",
    // Served locally rather than from a Drive thumbnail link: the old one
    // resolved to a screenshot of a different product entirely.
    image: process.env.PUBLIC_URL + "/images/projects/be-olivia.jpg",
    category: "AI/ML",
    tags: ["GCP Cloud Run", "Terraform", "Gemini", "Tripo3D", "Prisma", "Stripe"],
  },
  {
    id: 4,
    title: "No-Code AI Agent Builder",
    date: "June 2025",
    description:
      "A no-code platform letting users create and automate AI agents without writing code. Integrated memory, RAG and LLM tooling using LangChain, ChatGroq and HuggingFace Transformers, with CRON scheduling and Telegram/email delivery automation.",
    image: "https://github.com/ashishmaurya57/Imagesport/blob/main/no_code.png?raw=true",
    category: "AI/ML",
    github: "https://github.com/ashishmaurya57/nocode-ai-agent-builder",
    webapp: "https://no-code-ai-agent-builder-automation.netlify.app/",
    tags: ["LangChain", "Groq", "HuggingFace", "React.js", "Node.js", "MongoDB", "CRON"],
  },
  {
    id: 5,
    title: "AI Recruitment Agent",
    date: "July 2025",
    description:
      "A no-code recruitment assistant built on LangChain with HuggingFace embeddings and ChatGroq LLaMA-3. A vector store plus custom agent tools let recruiters interactively analyse resumes against job roles through a Streamlit front end.",
    image: "https://github.com/ashishmaurya57/Imagesport/blob/main/recruitment.png?raw=true",
    category: "AI/ML",
    github: "https://github.com/ashishmaurya57/Ai_powered_recruitment_agent",
    webapp: "https://aipoweredrecruitmentagent-ssabgtb3mnxedtfsmhg3xb.streamlit.app/",
    tags: ["LangChain", "HuggingFace", "ChatGroq", "Streamlit", "Vector Store"],
  },
  {
    id: 6,
    title: "Conversational Search Engine",
    date: "March 2025",
    description:
      "A conversational search engine using LangChain agents wired to Wikipedia, DuckDuckGo and ArXiv APIs, with memory, contextual QA and Groq-hosted LLaMA-3 responses.",
    image: "https://github.com/ashishmaurya57/Imagesport/blob/main/search_engine.png?raw=true",
    category: "AI/ML",
    webapp: "https://searchengineusingtoolandagent-9pp92gqr9ezwejh8gmtfgu.streamlit.app/",
    tags: ["LangChain", "Agents", "Streamlit", "Groq", "RAG"],
  },
  {
    id: 7,
    title: "PDF Q&A Assistant",
    date: "August 2024",
    description:
      "A Streamlit assistant that lets users upload PDFs and question them directly. RAG architecture over a vector store with Groq-hosted LLaMA-3 for grounded, contextual answers.",
    image: "https://github.com/ashishmaurya57/Imagesport/blob/main/ask_llm.png?raw=true",
    category: "AI/ML",
    github: "https://github.com/ashishmaurya57/LLM_expert_Assign/tree/main/app",
    webapp: "https://llmexpertassign-ciwknj8kkffsu7wxbmyteg.streamlit.app/",
    tags: ["RAG", "Vector Store", "LangChain", "Groq", "PDF Parsing"],
  },
  {
    id: 8,
    title: "Multilingual Book Recommender",
    date: "April 2025",
    description:
      "A book recommendation system combining multilingual sentiment analysis, user interaction tracking and transformer embeddings scored by cosine similarity.",
    image: "https://github.com/ashishmaurya57/Imagesport/blob/main/book_rec.png?raw=true",
    category: "AI/ML",
    github:
      "https://github.com/ashishmaurya57/Advance_Recommendation_system_website_using_deep-_learning_and_GEN_AI",
    tags: ["Transformers", "HuggingFace", "NLP", "Cosine Similarity", "Python"],
  },
  {
    id: 9,
    title: "SuperTrendy",
    date: "June — July 2024",
    description:
      "An e-commerce application for clothing with separate customer and administrator flows, covering catalogue, cart and order management on a MERN stack.",
    image: "https://raw.githubusercontent.com/ashishmaurya57/Imagesport/main/Supertrendy.JPG",
    category: "web app",
    github: "https://github.com/ashishmaurya57/SuperTrendy",
    webapp: "https://supertrendy.netlify.app/",
    tags: ["React.js", "Node.js", "Express.js", "MongoDB"],
    member: [
      {
        name: "Shikha Singh",
        img: "https://raw.githubusercontent.com/Shikha170/Weather/main/public/WhatsApp%20Image%202024-07-08%20at%2010.44.50.jpeg",
        linkedin: "https://www.linkedin.com/in/shikha-singh-2426a4257/",
        github: "https://github.com/Shikha170",
      },
      {
        name: "Ashish Maurya",
        img: "https://raw.githubusercontent.com/ashishmaurya57/Imagesport/main/WhatsApp%20Image%202024-07-08%20at%2010.45.59_d22abaf9.jpg",
        linkedin: "https://www.linkedin.com/in/ashish-maurya-iet-student-419788232/",
        github: "https://github.com/ashishmaurya57/",
      },
    ],
  },
  {
    id: 10,
    title: "Zomato Clone",
    date: "May 2024",
    description:
      "A full-stack food delivery application with menu browsing, cart, order placement and Stripe payments.",
    image: "https://raw.githubusercontent.com/ashishmaurya57/Imagesport/main/tomato.JPG",
    category: "web app",
    github: "https://github.com/ashishmaurya57/FoodDel",
    webapp: "https://food-delbyam.netlify.app/",
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "Stripe"],
    member: [
      {
        name: "Shikha Singh",
        img: "https://raw.githubusercontent.com/Shikha170/Weather/main/public/WhatsApp%20Image%202024-07-08%20at%2010.44.50.jpeg",
        linkedin: "https://www.linkedin.com/in/shikha-singh-2426a4257/",
        github: "https://github.com/Shikha170",
      },
      {
        name: "Ashish Maurya",
        img: "https://raw.githubusercontent.com/ashishmaurya57/Imagesport/main/WhatsApp%20Image%202024-07-08%20at%2010.45.59_d22abaf9.jpg",
        linkedin: "https://www.linkedin.com/in/ashish-maurya-iet-student-419788232/",
        github: "https://github.com/ashishmaurya57/",
      },
    ],
  },
  {
    id: 11,
    title: "Shehnayi",
    date: "July — Sept 2023",
    description:
      "A matrimonial site built with React and Bootstrap, covering profile browsing and search.",
    image: "https://raw.githubusercontent.com/ashishmaurya57/Imagesport/main/Shenayi.JPG",
    category: "web app",
    github: "https://github.com/ashishmaurya57/Shehnayi",
    webapp: "https://ashishmaurya57.github.io/Shehnayi/",
    tags: ["React.js", "Bootstrap", "JavaScript", "CSS"],
  },
  {
    id: 12,
    title: "ApnaDotCom",
    date: "April — June 2023",
    description:
      "A web application for selling websites and development services, covering service listings and site management.",
    image: "https://raw.githubusercontent.com/ashishmaurya57/Imagesport/main/apnadot.JPG",
    category: "web app",
    github: "https://github.com/ashishmaurya57/ApnaDotCom",
    webapp: "https://ashishmaurya57.github.io/ApnaDotCom/",
    tags: ["HTML", "CSS", "JavaScript", "jQuery"],
  },
  {
    id: 13,
    title: "Simon Memory Game",
    date: "Feb 2024",
    description:
      "A browser implementation of the classic Simon electronic memory game, with sequence generation and score tracking.",
    image: "https://raw.githubusercontent.com/ashishmaurya57/Imagesport/main/bigboos.JPG",
    category: "web app",
    github: "https://github.com/ashishmaurya57/BossSimonGame",
    webapp: "https://ashishmaurya57.github.io/BossSimonGame/",
    tags: ["HTML", "CSS", "JavaScript"],
  },
];

/* ------------------------------------------------------------------ *
 * Competitive programming
 * ------------------------------------------------------------------ */

export const codings = [
  {
    id: 0,
    platform: "LeetCode",
    icon: "SiLeetcode",
    rating: "1869",
    acheive: [
      "Knight badge on LeetCode",
      "Highest rating of 1869",
      "Global rank 1432 in Weekly Contest 386",
      "400+ DSA problems solved",
    ],
    link: "https://leetcode.com/ashishmaurya57/",
  },
  {
    id: 1,
    platform: "CodeChef",
    icon: "SiCodechef",
    rating: "1680",
    acheive: [
      "3-star rating",
      "Maximum rating of 1680",
      "Global rank 271 in Starter 103 among 25k+ participants",
      "150+ problems solved",
    ],
    link: "https://www.codechef.com/users/ashishmauryaam/",
  },
  {
    id: 2,
    platform: "Codeforces",
    icon: "SiCodeforces",
    rating: "1300",
    acheive: ["Pupil on Codeforces", "500+ problems solved"],
    link: "https://codeforces.com/profile/ashishmauryaam578",
  },
  {
    id: 3,
    platform: "GeeksforGeeks",
    icon: "SiGeeksforgeeks",
    rating: "",
    acheive: ["70+ problems solved"],
    link: "https://www.geeksforgeeks.org/user/ashishmauta9i/",
  },
];

/* ------------------------------------------------------------------ *
 * Education
 * ------------------------------------------------------------------ */

export const education = [
  {
    id: 0,
    school: "Institute of Engineering and Technology, Lucknow",
    date: "2021 — 2025",
    grade: "8.37 / 10 CGPA",
    degree: "B.Tech, Computer Science and Engineering (AI)",
    desc: "Computer science with an artificial intelligence specialisation. Coursework across data structures and algorithms, operating systems, database management, computer networks and object-oriented design.",
  },
  {
    id: 1,
    school: "St. Joseph's School, Gorakhpur",
    date: "April 2018 — June 2019",
    grade: "88.6%",
    degree: "Intermediate (Class 12)",
    desc: "Science stream with Computer Science.",
  },
];

/**
 * Empty on purpose: the Sept resume drops Advanced C++ and folds Sparkathon
 * into Achievements alongside LeetCode/CodeChef, which are already shown in
 * the Coding section — a separate Certifications block would just repeat them.
 */
export const certifications = [];

/** Single source of truth for nav + footer anchor links. */
export const navLinks = [
  { id: "about", label: "About", href: "#about" },
  { id: "focus", label: "Focus", href: "#focus" },
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "skills", label: "Skills", href: "#skills" },
  { id: "coding", label: "Coding", href: "#coding" },
  { id: "education", label: "Education", href: "#education" },
];
