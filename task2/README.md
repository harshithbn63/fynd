# Task 2: Two-Dashboard AI Feedback System

A full-stack web application featuring a User Dashboard for review submission and an Admin Dashboard for live monitoring and AI-powered insights.

## Project Structure
- `/backend`: FastAPI Python server handling LLM logic and database interactions.
- `/frontend`: Next.js application containing the two dashboards.

## Features
- **User Dashboard**:
    - Premium star selection and submission form.
    - Server-side AI-generated "Thank You" messages.
- **Admin Dashboard**:
    - Live-updating log of all submissions.
    - **AI Summarization**: One-sentence review summaries.
    - **Recommended Actions**: AI-suggested business improvements.
    - **Analytics**: Average ratings and sentiment distribution.

## Logic & Persistence
- **LLM**: Groq (Model: `llama-3.3-70b-versatile`) handles all logic server-side.
- **Database**: Supabase (PostgreSQL) stores all reviews and AI-generated content.

## Setup Instructions

### Backend
1. `cd backend`
2. Create virtual env: `python -m venv venv` and activate it.
3. Install dependencies: `pip install -r requirements.txt` (or install manually: `fastapi uvicorn supabase groq python-dotenv`)
4. Create `.env` based on `.env.example` and add your keys.
5. Run: `uvicorn main:app --reload`

### Frontend
1. `cd frontend`
2. Install dependencies: `npm install`
3. Run: `npm run dev`
4. Access User Dashboard at `http://localhost:3000` and Admin Dashboard at `http://localhost:3000/admin`.

## Design Decisions
- **FastAPI**: Chosen for its high performance and native Python support for AI libraries.
- **Next.js**: Used for the frontend to leverage server-side rendering and a modern component architecture.
- **Tailwind CSS**: Used for creating a premium, dark-themed responsive design.
