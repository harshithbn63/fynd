# Task 1: Rating Prediction via Prompting

This task involves using LLMs to classify Yelp reviews into 1-5 star ratings based on text feedback.

## Objectives
- Design and test at least 3 prompting approaches.
- Evaluate performance on a sampled dataset of 200 reviews.
- Analyze accuracy, JSON validity, and consistency.

## Prompting Approaches
1. **Zero-shot**: Direct instruction without context. Great for speed and testing base knowledge.
2. **Few-shot**: Includes 3 diverse examples (1-star, 3-star, 5-star). Helps the model understand common tone patterns.
3. **Structured Chain-of-Thought (CoT)**: Instructs the model to analyze keywords and sentiment indicators *before* predicting the rating. This provides the most interpretable results.

## Setup
1. Open `task1_rating_prediction.ipynb` in a Jupyter environment.
2. Install dependencies: `pip install groq pandas scikit-learn tqdm python-dotenv`
3. Create a `.env` file with `GROQ_API_KEY=your_key`.
4. Run all cells to trigger the **Parallel Async Engine**.

## Methodology
- **Data Source**: Yelp Reviews Dataset (Kaggle).
- **Sampling**: 200 rows sampled using `prepare_data.py`.
- **Model**: `llama-3.1-8b-instant` (Optimized for speed/cost).
- **Execution**: Asynchronous Parallel processing (10 concurrent requests at a time).
- **Time to Complete**: ~2-3 minutes for 600 total API calls (200 reviews x 3 prompts).
