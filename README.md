# 📡 CreativeRadar AI – Multimodal Ad Intelligence Platform for Mobile Games

> **Production-Ready Clean Architecture AI Platform** designed for mobile gaming giants (Dream Games / Royal Match, Playrix, Peak Games).

`CreativeRadar AI` automatically ingests competitor video creatives (Meta Ad Library, TikTok Creative Center), extracts timestamped multimodal insights using **LangGraph AI Agents**, **Gemini 1.5 Pro Vision**, **Faster-Whisper Audio Transcription**, and **EasyOCR**, indexes dense semantic vectors into **Qdrant**, and provides CEO/CMO level executive dashboards and RAG Strategy Copilots.

---

## 🏗️ System Architecture & Stack

```
CreativeRadar AI/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # REST Endpoints (Ads, Analytics, Collection, Strategy)
│   │   ├── agents/          # LangGraph StateGraph Multi-Agent Workflows
│   │   ├── services/        # Multimodal Wrappers (Gemini Vision, Whisper, OCR, Qdrant)
│   │   ├── db/              # Async PostgreSQL SQLAlchemy 2.0 Models & Seeders
│   │   ├── core/            # App Settings & Celery Redis Queue
│   │   └── schemas/         # Pydantic DTO Schemas
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/app/             # Next.js 14 App Router Pages (Dashboard, Ad-Search, Ads Detail, Strategy-AI)
│   ├── src/components/      # Synchronized Video Player, Storyboard Timeline, HSL Palette Cards
│   └── package.json
└── docker-compose.yml
```

### Tech Stack Highlights:
- **Backend**: Python 3.11+, FastAPI (Async), LangGraph & LangChain, SQLAlchemy 2.0, Qdrant Vector DB, Faster-Whisper, OpenCV.
- **Frontend**: Next.js 14+ (App Router), Tailwind CSS, Lucide Icons, Recharts, Framer Motion.
- **AI Models**: Gemini 1.5 Pro / Flash, OpenAI Whisper (large-v3), EasyOCR.

---

## ⚡ Quick Start Guide

### 1. Backend Setup & Local Server

```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate
pip install -r requirements.txt

# Run FastAPI Dev Server (Auto-migrates DB & Seeds Initial Competitor Ads)
uvicorn app.main:app --reload --port 8000
```
- Interactive Swagger API Docs: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:3000` in your browser.

### 3. Docker Compose (Full Stack Microservices)

```bash
docker-compose up --build
```

---

## 🌟 Key Features

1. **Executive Command Center (`/dashboard`)**:
   - Monitored ad volumes, top performing hook type share percentages, dominant HSL/HEX color pairing frequencies, and competitor market share.
2. **Semantic Ad Library & Hybrid Search (`/ad-search`)**:
   - Dense vector search powered by Qdrant allowing natural language queries like *"Boiling lava puzzle rescue with King Robert"*.
3. **Synchronized Frame Breakdown Player (`/ads/[id]`)**:
   - HTML5 video player synchronized with timestamped AI Storyboard scenes, Faster-Whisper speech transcript, OpenCV OCR overlay text, and clickable HEX color palette copy.
4. **AI Strategy Copilot & Brief Generator (`/strategy-ai`)**:
   - RAG-powered interactive chat that retrieves top competitor benchmarks and generates instant executive creative briefs and scene scripts.
