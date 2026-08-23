# UniAssist AI — Production-Ready Multilingual University AI Assistant Using RAG

UniAssist AI is a complete, enterprise-grade University AI Knowledge & Conversational Assistant platform built with **Hybrid RAG (Retrieval-Augmented Generation)**, structured relational academic dataset integration, multilingual natural language understanding (**English, Telugu, Hindi**), voice speech-to-text & text-to-speech interaction, and administrative knowledge governance.

---

## 🏛️ System Architecture

```
                                  ┌─────────────────────────────────────────────────────────┐
                                  │            Modern Frontend (Next.js 16)                 │
                                  │  - AI Chat with Citations, Streaming & History          │
                                  │  - Multilingual Engine (EN, Telugu, Hindi)              │
                                  │  - Structured Assessment Explorer (OULAD Dataset)       │
                                  │  - Campus Notice Board, Academic Calendar & Fees        │
                                  │  - Scholarship Matcher & Placement Hub                  │
                                  │  - Admin Knowledge Management & Observability           │
                                  └────────────────────────────┬────────────────────────────┘
                                                               │ REST / SSE Streaming
                                                               ▼
                                  ┌─────────────────────────────────────────────────────────┐
                                  │             FastAPI Backend Intelligence Engine         │
                                  │  - JWT Authentication & Role-Based Access (RBAC)        │
                                  │  - Intelligent Intent Classifier & Query Router         │
                                  │  - Document Ingestion Pipeline (PDF, DOCX, TXT, OCR)    │
                                  │  - Deterministic Zero-Hallucination Grounding Prompt    │
                                  │  - Multilingual Concept Mapper & Script Detector        │
                                  └────────────────────────────┬────────────────────────────┘
                                                               │
                             ┌─────────────────────────────────┴─────────────────────────────────┐
                             ▼                                                                   ▼
┌─────────────────────────────────────────────────────────┐ ┌─────────────────────────────────────────────────────────┐
│              Relational SQL Engine                      │ │              Vector Knowledge Base (RAG)              │
│  - `assessments` (199 records from assessments.csv)     │ │  - Academic Regulations 2026 (Credits, Grading, SGPA) │
│  - `notices`, `scholarships`, `fee_structures`          │ │  - Attendance Policies (Mandatory 75%, Condonation)   │
│  - `placement_drives`, `academic_calendar`              │ │  - Examination Rules & Malpractice Penalties          │
│  - `conversations`, `messages`, `feedback`              │ │  - Placements, Eligibility Criteria & Packages        │
│  - Users & Roles (Student, Faculty, Admin)              │ │  - Uploaded Documents, PDF Chunks & Embeddings        │
│  (PostgreSQL + pgvector / SQLite auto-switch)           │ │  - Cosine Similarity Search & Strict Grounding        │
└─────────────────────────────────────────────────────────┘ └─────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 1. Hybrid RAG Intelligence Layer
- **Structured SQL Queries:** Direct parametric database queries for assessment codes (e.g. `module AAA`, `2013J`, `TMA`, `weightage`), upcoming exams, circulars, fees, and scholarship criteria.
- **Vector Semantic Search:** Cosine similarity retrieval over 46+ knowledge chunks with metadata filtering and strict thresholding.
- **Zero Hallucination Guarantee:** Grounded synthesis enforcing that if a topic is not in the knowledge base, the assistant explicitly responds: *"I couldn't find this information in the university knowledge base."*
- **Clickable Grounded Citations:** Each answer displays verified citations with Document Title, Section, Page Number, and Version Date.

### 2. Multilingual AI Assistant
- Native support for **English**, **Telugu (తెలుగు)**, and **Hindi (हिंदी)**.
- Transliterated keyword detection and cross-lingual concept mapping (e.g., *"హాజరు శాతం ఎంత ఉండాలి?"* -> maps to the 75% attendance policy).

### 3. Voice AI Assistant
- Built-in microphone Speech-to-Text (STT) with animated sound wave visualizer.
- Text-to-Speech (TTS) voice readout with audio controls.

### 4. Structured Dataset Integration (`assessments.csv`)
- Full relational ingestion of the Open University Learning Analytics Dataset (OULAD) schema:
  `code_module`, `code_presentation`, `id_assessment`, `assessment_type`, `date`, `weight`.
- Dedicated Assessment Explorer dashboard with module filters (AAA-GGG), presentations, and weight distribution bars.

### 5. Document Ingestion Pipeline
- Supports uploading **PDF**, **DOCX**, **TXT**, **MD**, and **Images**.
- Automatic text extraction, OCR pre-processing, recursive character chunking (with overlap), dense embedding generation, and vector indexing.

### 6. Role-Based Access Control (RBAC) & Test Accounts

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Student** | `student@university.edu` | `Student@123` | Chat, Search, Assessments, Notices, Calendar, Scholarships, History |
| **Faculty** | `faculty@university.edu` | `Faculty@123` | Student features + Academic documents access |
| **Admin** | `admin@university.edu` | `Admin@123` | All features + Ingestion pipeline, Re-indexing, Notices CRUD, Telemetry |

---

## 🚀 Quick Start & Local Run

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** and **npm**

### Step 1: Start the Backend
```bash
# 1. Install dependencies
pip install -r backend/requirements.txt

# 2. Seed database & vector embeddings
python -m backend.app.utils.seed_data

# 3. Start FastAPI server
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Backend API docs available at:* `http://localhost:8000/docs`

### Step 2: Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend will be running at:* `http://localhost:3000`

---

## 🐳 Docker Multi-Container Deployment

To deploy the entire production stack (PostgreSQL with `pgvector`, FastAPI backend, and Next.js frontend) with Docker Compose:

```bash
docker-compose up --build
```

- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:8000`
- **PostgreSQL + pgvector:** `localhost:5432`

---

## 🧪 Automated Test Suite

Run unit and integration tests with `pytest`:
```bash
python -m pytest backend/tests/test_backend.py -v
```

The test suite validates:
- Health check endpoint
- JWT Authentication & RBAC
- Structured assessment queries on `assessments.csv`
- Notices & Scholarships API
- Query router intent classification
- 75% Attendance policy grounded RAG retrieval
- Multilingual Telugu query handling
- Hallucination resistance on unknown questions

---

## 📚 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token |
| `POST` | `/api/chat` | Main conversational RAG endpoint |
| `POST` | `/api/chat/stream` | Real-time SSE streaming RAG response |
| `GET` | `/api/chat/history` | Retrieve user chat conversations |
| `POST` | `/api/chat/feedback` | Submit 👍 / 👎 feedback on answers |
| `GET` | `/api/assessments` | Query structured assessment schedules |
| `GET` | `/api/assessments/upcoming` | Fetch upcoming assessments |
| `GET` | `/api/documents` | List knowledge base documents |
| `POST` | `/api/documents/upload` | Upload & index PDF/DOCX/Image |
| `GET` | `/api/notices` | Fetch official campus circulars |
| `GET` | `/api/scholarships` | List scholarship schemes |
| `POST` | `/api/scholarships/match` | Interactive eligibility matching |
| `GET` | `/api/calendar` | Academic calendar & holiday events |
| `GET` | `/api/fees` | Tuition & hostel fee schedules |
| `GET` | `/api/placements` | Placement drives & CTC packages |
| `GET` | `/api/admin/stats` | System observability & gap analytics |

---

## 📄 License
MIT License. Built for University academic intelligence and student welfare.
