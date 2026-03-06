import { useEffect, useState } from "react";
import API from "../services/api";

function timeAgo(dateStr) {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} mins ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
}

function RecentIssues() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get("/tickets", {
            params: { priority: "Critical", page: 1, limit: 3, sort_by: "created_at", order: "desc" },
        })
            .then((res) => {
                setIssues(res.data.data || []);
            })
            .catch(() => setIssues([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner" />
                Loading...
            </div>
        );
    }

    if (issues.length === 0) {
        return (
            <div className="panel-body">
                <div className="loading-spinner">No critical issues found</div>
            </div>
        );
    }

    return (
        <>
            <ul className="recent-issues-list">
                {issues.map((issue, i) => {
                    const pClass = (issue.priority || "").toLowerCase();
                    const typeLabel = (issue.type || "unknown").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
                    return (
                        <li className="recent-issue-item" key={i}>
                            <div className={`recent-issue-icon ${pClass === "critical" ? "critical" : "high"}`}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                            </div>
                            <div className="recent-issue-info">
                                <div className="recent-issue-title">{typeLabel}: {issue.issue_id}</div>
                                <div className="recent-issue-meta">
                                    ID: #{issue.ticket_id} · {timeAgo(issue.created_at)}
                                </div>
                            </div>
                            <span className={`recent-issue-badge ${pClass === "critical" ? "critical" : "high"}`}>
                                {issue.priority}
                            </span>
                        </li>
                    );
                })}
            </ul>
            <a href="/tickets" className="view-all-link">View All Issues</a>
        </>
    );
}

export default RecentIssues;
