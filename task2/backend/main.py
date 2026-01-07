from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import datetime
from supabase import create_client, Client
from groq import Groq
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import json

load_dotenv()

app = FastAPI(title="Fynd AI Feedback System API")

# CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")
supabase: Client = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

# Initialize Groq
groq_key = os.getenv("GROQ_API_KEY")
if groq_key:
    client = Groq(api_key=groq_key)
    # Using Llama 3.3 70B for high quality responses
    MODEL_NAME = "llama-3.3-70b-versatile"
else:
    client = None

class ReviewSubmission(BaseModel):
    rating: int
    review: str

class Review(BaseModel):
    id: str
    rating: int
    review: str
    user_response: str
    ai_summary: str
    ai_actions: str
    created_at: str

@app.get("/")
def read_root():
    return {"status": "healthy", "service": "Fynd AI Backend"}

@app.post("/reviews")
async def create_review(submission: ReviewSubmission):
    if not submission.review.strip():
        # Handle empty review gracefully as per requirements
        user_response = "We appreciate your rating! Would you like to tell us more about your experience?"
        ai_summary = "User provided a rating without a text review."
        ai_actions = "No specific action needed for empty review."
    else:
        try:
            # AI Logic
            prompt = f"""
            Analyze this Yelp-style review:
            Rating: {submission.rating}/5
            Review: {submission.review}
            
            Provide the following in strictly valid JSON format:
            1. "user_response": A friendly, professional response to the user.
            2. "ai_summary": A one-sentence summary of the feedback for an admin.
            3. "ai_actions": A bulleted list of 2-3 suggested actions for the business based on this review.
            """
            
            if client:
                chat_completion = client.chat.completions.create(
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a helpful assistant that analyzes business reviews and returns JSON."
                        },
                        {
                            "role": "user",
                            "content": prompt,
                        }
                    ],
                    model=MODEL_NAME,
                    response_format={"type": "json_object"}
                )
                ai_data = json.loads(chat_completion.choices[0].message.content)
                user_response = ai_data.get("user_response", "Thank you for your feedback!")
                ai_summary = ai_data.get("ai_summary", "Review received.")
                ai_actions = ai_data.get("ai_actions", "Monitor feedback.")
            else:
                user_response = "Thank you for your feedback! (AI Service Offline)"
                ai_summary = "Review received (Summary unavailable)."
                ai_actions = "N/A"
                
        except Exception as e:
            user_response = "Thank you for your feedback! We've received your submission."
            ai_summary = f"Error processing LLM: {str(e)}"
            ai_actions = "Manual review required due to system failure."

    # Store in Supabase
    data = {
        "rating": submission.rating,
        "review": submission.review,
        "user_response": user_response,
        "ai_summary": ai_summary,
        "ai_actions": ai_actions,
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    
    if supabase:
        res = supabase.table("reviews").insert(data).execute()
        if not res.data:
            raise HTTPException(status_code=500, detail="Failed to store review")
    
    return {
        "message": "Review submitted successfully",
        "user_response": user_response
    }

@app.get("/reviews", response_model=List[Review])
async def get_reviews():
    if not supabase:
        return []
    res = supabase.table("reviews").select("*").order("created_at", desc=True).execute()
    return res.data

@app.get("/analytics")
async def get_analytics():
    if not supabase:
        return {"total": 0, "average_rating": 0}
    
    res = supabase.table("reviews").select("rating").execute()
    ratings = [r['rating'] for r in res.data]
    
    if not ratings:
        return {"total": 0, "average_rating": 0, "distribution": {}}
    
    return {
        "total": len(ratings),
        "average_rating": sum(ratings) / len(ratings),
        "distribution": {i: ratings.count(i) for i in range(1, 6)}
    }
