"use client";

import { useState, useEffect } from "react";
import {
    BarChart3,
    MessageSquare,
    Star,
    TrendingUp,
    Filter,
    RefreshCcw,
    ClipboardList,
    Sparkles,
    Zap,
    Moon,
    Sun,
    ChevronDown
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Review {
    id: string;
    rating: number;
    review: string;
    user_response: string;
    ai_summary: string;
    ai_actions: string;
    created_at: string;
}

interface Analytics {
    total: number;
    average_rating: number;
    distribution: Record<string, number>;
}

export default function AdminDashboard() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<number | null>(null);
    const [theme, setTheme] = useState<"light" | "dark">("dark");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === "light" ? "dark" : "light");
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const [resReviews, resAnalytics] = await Promise.all([
                fetch(`${apiUrl}/reviews`),
                fetch(`${apiUrl}/analytics`)
            ]);
            const dataReviews = await resReviews.json();
            const dataAnalytics = await resAnalytics.json();
            setReviews(dataReviews);
            setAnalytics(dataAnalytics);
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const filteredReviews = filter
        ? reviews.filter(r => r.rating === filter)
        : reviews;

    const positiveRatio = analytics?.total
        ? (((analytics.distribution["4"] || 0) + (analytics.distribution["5"] || 0)) / analytics.total * 100).toFixed(0)
        : 0;

    return (
        <div className="dashboard-container">
            <button onClick={toggleTheme} className="theme-toggle">
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Admin Insights</h1>
                    <p className="opacity-60 text-lg font-medium">Monitoring sentiment and AI insights.</p>
                </div>
                <button
                    onClick={fetchData}
                    className="action-btn"
                >
                    <RefreshCcw size={18} className={cn(loading && "animate-spin")} />
                    Refresh Data
                </button>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <StatCard
                    title="Total Reviews"
                    value={analytics?.total || 0}
                    icon={<MessageSquare size={24} />}
                    color="rgba(59, 130, 246, 0.2)"
                    iconColor="#3b82f6"
                />
                <StatCard
                    title="Avg Rating"
                    value={analytics?.average_rating?.toFixed(1) || "0.0"}
                    icon={<Star size={24} />}
                    color="rgba(250, 204, 21, 0.2)"
                    iconColor="#facc15"
                />
                <StatCard
                    title="Positive Ratio"
                    value={`${positiveRatio}%`}
                    icon={<TrendingUp size={24} />}
                    color="rgba(34, 197, 94, 0.2)"
                    iconColor="#22c55e"
                />
                <StatCard
                    title="AI Efficiency"
                    value="100%"
                    icon={<Zap size={24} />}
                    color="rgba(168, 85, 247, 0.2)"
                    iconColor="#a855f7"
                />
            </div>

            {/* Main Content */}
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                    <div className="flex items-center gap-2">
                        <ClipboardList className="opacity-40" size={20} />
                        <h2 className="text-xl font-extrabold uppercase tracking-tight">Submissions Log</h2>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                        <span className="text-[10px] font-black uppercase opacity-40 mr-2">Filter</span>
                        <button
                            onClick={() => setFilter(null)}
                            className={cn("pill-btn", filter === null && "active")}
                        >
                            All
                        </button>
                        {[5, 4, 3, 2, 1].map(num => (
                            <button
                                key={num}
                                onClick={() => setFilter(num)}
                                className={cn("pill-btn flex items-center gap-1", filter === num && "active")}
                            >
                                {num} <Star size={12} fill={filter === num ? "white" : "none"} />
                            </button>
                        ))}
                    </div>
                </div>

                {loading && reviews.length === 0 ? (
                    <div className="text-center py-20 opacity-50 font-bold uppercase tracking-widest animate-pulse">
                        Loading reviews...
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="text-center py-24 bg-zinc-500/5 rounded-3xl border-2 border-dashed border-zinc-500/10">
                        <p className="opacity-50">No reviews found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredReviews.map((item) => (
                            <div key={item.id} className="log-item">
                                <div className="log-section">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    fill={i < item.rating ? "#facc15" : "none"}
                                                    className={cn(
                                                        i < item.rating ? "text-yellow-400" : "opacity-10"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">
                                            {new Date(item.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-lg font-bold leading-snug">"{item.review || "(No text provided)"}"</p>
                                </div>

                                <div className="log-divider" />

                                <div className="log-section">
                                    <div className="mb-6">
                                        <div className="ai-tag">
                                            <Sparkles size={12} /> AI Summary
                                        </div>
                                        <p className="opacity-70 text-sm italic font-medium">
                                            {item.ai_summary}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="ai-tag">
                                            <Zap size={12} /> Recommended Actions
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            {item.ai_actions.split('\n').filter(a => a.trim()).map((action, i) => (
                                                <div key={i} className="text-xs bg-zinc-500/5 p-3 rounded-xl border border-zinc-500/10 font-medium">
                                                    {action.replace(/^[-\*\d\.]+\s*/, '')}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, iconColor }: any) {
    return (
        <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: color, color: iconColor }}>
                {icon}
            </div>
            <div>
                <span className="text-label">{title}</span>
                <p className="text-3xl font-black">{value}</p>
            </div>
        </div>
    );
}
