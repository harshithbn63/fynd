"use client";

import { useState, useEffect } from "react";
import { Star, Send, CheckCircle, AlertCircle, XCircle, Moon, Sun } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function UserDashboard() {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [aiResponse, setAiResponse] = useState("");
    const [error, setError] = useState("");
    const [theme, setTheme] = useState<"light" | "dark">("dark");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === "light" ? "dark" : "light");
    };

    const handleStarClick = (star: number) => {
        setRating(current => current === star ? 0 : star);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError("Please select a star rating to share your experience.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(`${apiUrl}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, review }),
            });

            if (!res.ok) throw new Error("Connection failed");

            const data = await res.json();
            setAiResponse(data.user_response);
            setSubmitted(true);
        } catch (err) {
            setError("Unable to submit. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const renderHeader = () => (
        <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Tell us your experience</h1>
            <p className="opacity-70">Your feedback helps us evolve.</p>
        </div>
    );

    if (submitted) {
        return (
            <div className="centered-layout">
                <button onClick={toggleTheme} className="theme-toggle">
                    {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                <div className="premium-card text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
                    <p className="opacity-70 mb-8 leading-relaxed italic text-lg">
                        "{aiResponse}"
                    </p>
                    <button
                        onClick={() => {
                            setSubmitted(false);
                            setRating(0);
                            setReview("");
                            setAiResponse("");
                        }}
                        className="action-btn"
                    >
                        Submit Another Review
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="centered-layout">
            <button onClick={toggleTheme} className="theme-toggle">
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div className="premium-card">
                {renderHeader()}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-sm font-semibold uppercase tracking-widest text-center block opacity-80">Rating</label>
                        <div className="flex justify-center items-center gap-4">
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleStarClick(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        className="star-btn"
                                    >
                                        <Star
                                            size={42}
                                            fill={(hover || rating) >= star ? "#FACC15" : "none"}
                                            strokeWidth={1.5}
                                            className={cn(
                                                "transition-all duration-300",
                                                (hover || rating) >= star
                                                    ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]"
                                                    : "opacity-20"
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setRating(0)}
                                    className="clear-btn mt-1"
                                >
                                    <XCircle size={14} /> Clear
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-semibold uppercase tracking-widest opacity-80">Review (Optional)</label>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="What did you think of our service?"
                            className="input-field min-h-[140px]"
                        />
                    </div>

                    {error && (
                        <div className="error-tag animate-in slide-in-from-bottom-2">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="action-btn"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent animate-spin rounded-full" />
                        ) : (
                            <>
                                Submit Feedback <Send size={18} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
