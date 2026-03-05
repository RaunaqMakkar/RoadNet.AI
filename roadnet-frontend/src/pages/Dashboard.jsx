import { useEffect, useState } from "react";
import API from "../services/api";
import KPICard from "../components/KPICard";
import MapPreview from "../components/MapPreview";
import PriorityChart from "../components/PriorityChart";
import IssueTypeChart from "../components/IssueTypeChart";
import RecentIssues from "../components/RecentIssues";
import "../styles/Dashboard.css";

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get("/stats")
            .then((res) => setStats(res.data))
            .catch(() => setStats(null))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="dashboard">
                <div className="loading-spinner">
                    <div className="spinner" />
                    Loading dashboard...
                </div>
            </div>
        );
    }

    const total = stats?.total_tickets || 0;
    const priorityBreakdown = stats?.breakdown_by_priority || {};
    const typeBreakdown = stats?.breakdown_by_type || {};
    const statusBreakdown = stats?.breakdown_by_status || {};
    const avgRps = stats?.avg_rps_score || 0;

    const critical = priorityBreakdown["Critical"] || 0;
    const high = (priorityBreakdown["High"] || 0);
    const closed = statusBreakdown["Closed"] || 0;
    const closedRatio = total > 0 ? Math.round((closed / total) * 100) : 0;

    const topType = Object.entries(typeBreakdown).sort((a, b) => b[1] - a[1])[0];
    const topTypeName = topType
        ? topType[0].replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "—";

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <h1>Operational Overview</h1>
                <p>Real-time infrastructure health and incident reporting</p>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <KPICard
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>}
                    iconColor="blue"
                    title="TOTAL ACTIVE"
                    value={(total - closed).toLocaleString()}
                    trend="~12%"
                    trendDir="up"
                />
                <KPICard
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>}
                    iconColor="red"
                    title="CRITICAL"
                    value={critical.toLocaleString()}
                    trend="~5%"
                    trendDir="up"
                />
                <KPICard
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>}
                    iconColor="orange"
                    title="HIGH PRIORITY"
                    value={high.toLocaleString()}
                    trend="~2%"
                    trendDir="up"
                />
                <KPICard
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>}
                    iconColor="green"
                    title="AVG RPS SCORE"
                    value={avgRps}
                    trend="~1.5"
                    trendDir="up"
                />
                <KPICard
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
                    iconColor="indigo"
                    title="CLOSED RATIO"
                    value={`${closedRatio}%`}
                    trend="~4%"
                    trendDir="up"
                />
                <KPICard
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="15" rx="2" /><polyline points="17 2 12 7 7 2" /></svg>}
                    iconColor="blue"
                    title="TOP TYPE"
                    value={topTypeName}
                    isText
                />
            </div>

            {/* Main Grid: Map + Priority/Issue Charts */}
            <div className="dashboard-grid">
                {/* Left: Map */}
                <div className="panel">
                    <div className="panel-header">
                        <h2>Active Network Incidents</h2>
                        <a href="/map">GO TO LIVE MAP ↗</a>
                    </div>
                    <div className="panel-body">
                        <MapPreview />
                    </div>
                </div>

                {/* Right Column */}
                <div className="right-column">
                    <div className="panel">
                        <div className="panel-header">
                            <h2>Priority Distribution</h2>
                        </div>
                        <PriorityChart breakdown={priorityBreakdown} total={total} />
                    </div>

                    <div className="panel">
                        <div className="panel-header">
                            <h2>Issue Type Frequency</h2>
                        </div>
                        <IssueTypeChart typeBreakdown={typeBreakdown} />
                    </div>
                </div>
            </div>

            {/* Bottom Row: Recent Issues + CTA */}
            <div className="bottom-row">
                <div className="panel">
                    <div className="panel-header">
                        <h2>Recent Critical Issues</h2>
                    </div>
                    <div className="panel-body">
                        <RecentIssues />
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-end" }}>
                    <button className="fab">+ Create New Incident</button>
                </div>
            </div>

            {/* Status Bar */}
            <div className="status-bar">
                <div className="status-bar-left">
                    <span><span className="status-dot" /> SYSTEM ONLINE</span>
                    <span><span className="status-dot" /> API STABLE</span>
                </div>
                <span>
                    LAST SYNC: {new Date().toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    }).toUpperCase()}
                </span>
            </div>
        </div>
    );
}

export default Dashboard;
