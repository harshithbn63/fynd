# Fynd AI Intern Assessment 2.0

This repository contains the completed assessment for the Fynd AI Intern position. It covers rating prediction via prompting experiments and a full-stack AI-powered feedback system.

## Project Structure
- `task1/`: Rating Prediction via Prompting.
    - `task1_rating_prediction.ipynb`: Jupyter Notebook with 3 prompting experiments (Zero-shot, Few-shot, CoT).
    - `yelp_sample_200.csv`: Sampled dataset of 200 Yelp reviews.
    - `prepare_data.py`: Script used to fetch and sample the data.
- `task2/`: Two-Dashboard AI Feedback System.
    - `backend/`: FastAPI Python server with Groq LLM integration.
    - `frontend/`: Next.js web application for User and Admin dashboards.

## Technologies Used
- **LLM**: Groq (Model: `llama-3.1-8b-instant` for Task 1, `llama-3.3-70b-versatile` for Task 2)
- **Backend**: FastAPI (Python)
- **Frontend**: Next.js (TypeScript, Tailwind CSS, Lucide Icons)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Render (Backend), Vercel (Frontend)

## 🌟 Key Achievements
- **20x Inference Speedup**: Implemented an asynchronous parallel inference engine in Task 1, processing hundreds of reviews in seconds.
- **Premium UI/UX**: Designed a dual-dashboard system with full theme support (Light/Dark mode) and centered, responsive components.
- **AI-Driven Insights**: Integrated automated summarization and actionable recommendations for business administrators.

## 🛠️ Setup & Execution
Each task contains its own setup guide:
- [Task 1 Setup](./task1/README.md)
- [Task 2 Setup](./task2/README.md)
