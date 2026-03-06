import { useEffect, useState } from "react";
import API from "../services/api";
import AnalyticsStats from "../components/AnalyticsStats";
import IssuesOverTimeChart from "../components/IssuesOverTimeChart";
import PriorityBreakdownChart from "../components/PriorityBreakdownChart";
import ZoneIssues from "../components/ZoneIssues";
import DepartmentWorkload from "../components/DepartmentWorkload";
import RPSTrendChart from "../components/RPSTrendChart";
import PredictiveInsights from "../components/PredictiveInsights";
import "../styles/Analytics.css";

function Analytics() {
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
            <div className="analytics-page">
                <div className="loading-spinner"><div className="spinner" /> Loading analytics...</div>
            </div>
        );
    }

    const total = stats?.total_tickets || 0;
    const avgRps = stats?.avg_rps_score || 0;
    const priorityBreakdown = stats?.breakdown_by_priority || {};

    return (
        <div className="analytics-page">
            {/* Header */}
            <div className="analytics-header">
                <div className="analytics-header-text">
                    <h1>Infrastructure Analytics</h1>
                    <p>Comprehensive data insights for municipal road management and predictive maintenance.</p>
                </div>
                <div className="analytics-header-actions">
                    <button className="btn-outline">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        Last 30 Days
                    </button>
                    <button className="btn-export">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                        Export PDF
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <AnalyticsStats stats={stats} />

            {/* Charts Row: Line + Donut */}
            <div className="analytics-charts-row">
                <IssuesOverTimeChart total={total} />
                <PriorityBreakdownChart breakdown={priorityBreakdown} total={total} />
            </div>

            {/* Bottom Row: Zones + Departments + RPS */}
            <div className="analytics-bottom-row">
                <ZoneIssues total={total} />
                <DepartmentWorkload />
                <RPSTrendChart avgRps={avgRps} />
            </div>

            {/* Predictive Insights */}
            <PredictiveInsights />

            {/* Footer */}
            <div className="analytics-footer">
                © 2024 RoadNet.AI Infrastructure Intelligence Engine. All data is encrypted and compliant with municipal standards.
            </div>
        </div>
    );
}

export default Analytics;
