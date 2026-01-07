# Assessment Report: Fynd AI Intern

## 1. Overall Approach
The goal was to build a system that bridges the gap between raw data analysis (Task 1) and a production-grade user application (Task 2). I implemented a high-performance **Async Inference Engine** for research and a **FastAPI/Next.js** stack for the dashboard to ensure sub-second latency and premium user experience.

## 2. Task 1: Rating Prediction Analysis
I evaluated 200 Yelp reviews using three distinct prompting strategies on the `llama-3.1-8b-instant` model.

### Prompting Strategies
1.  **Zero-shot**: "Classify the following Yelp review into a 1 to 5 star rating. Return JSON with 'predicted_stars' and 'explanation'."
    *   *Rationale*: Tests base model knowledge without bias.
2.  **Few-shot**: Included 3 diverse examples (1, 3, 5 stars) before the task.
    *   *Rationale*: Provides context on sentiment balance.
3.  **Chain-of-Thought (CoT)**: Required step-by-step analysis of sentiment and quality.
    *   *Rationale*: Forces clear reasoning for mixed reviews.

### Evaluation Results (N=200)
| Strategy | Accuracy | JSON Validity Rate | Consistency |
| :--- | :--- | :--- | :--- |
| **Zero-shot** | **0.62** | 100% | High |
| **Few-shot** | 0.57 | 100% | Medium |
| **Chain-of-Thought** | **0.63** | 100% | Excellent |

### Discussion & Trade-offs
- **Simplicity Wins**: Zero-shot performed best initially, but the refined CoT approach provided the most consistent results across all categories.
- **Reliability**: Chain-of-Thought provides the best reasoning, which is critical for the Admin insights in Task 2.
- **Async Handling**: Optimized the engine for 10 concurrent requests to maximize speed without triggering rate limits.

---

## 3. Task 2: System Architecture
- **Tech Stack**: Next.js (App Router), FastAPI, Groq (llama-3.3-70b-versatile).
- **Theme Support**: Integrated Light/Dark mode with a premium centered UI.
- **AI Integration**:
    - **User Service**: Empathetic responses to feedback.
    - **Admin Analytics**: Summarization and "Recommended Actions" for every review.

## 4. Design Decisions
- **Port 8000/3000**: Standardized ports for ease of verification.
- **Async Processing**: Used `asyncio` to process hundreds of reviews in under 5 minutes.
- **Data Persistence**: Integrated Supabase to handle all data storage and retrieval.
