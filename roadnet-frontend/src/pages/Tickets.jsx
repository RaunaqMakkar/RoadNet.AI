import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import TicketStats from "../components/TicketStats";
import TicketFilters from "../components/TicketFilters";
import TicketTable from "../components/TicketTable";
import Pagination from "../components/Pagination";
import "../styles/Tickets.css";

const LIMIT = 10;

function Tickets() {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("");

    const fetchTickets = useCallback(() => {
        setLoading(true);
        const params = { page, limit: LIMIT, sort_by: "created_at", order: "desc" };
        if (priority) params.priority = priority;
        if (status) params.status = status;

        API.get("/tickets", { params })
            .then((res) => {
                setData(res.data.data || []);
                setTotal(res.data.total || 0);
                setTotalPages(res.data.total_pages || 0);
            })
            .catch(() => {
                setData([]);
                setTotal(0);
                setTotalPages(0);
            })
            .finally(() => setLoading(false));
    }, [page, priority, status]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const handlePriorityChange = (val) => {
        setPriority(val);
        setPage(1);
    };

    const handleStatusChange = (val) => {
        setStatus(val);
        setPage(1);
    };

    const filteredData = search.trim()
        ? data.filter((t) => {
            const q = search.toLowerCase();
            return (
                (t.ticket_id || "").toLowerCase().includes(q) ||
                (t.assigned_department || "").toLowerCase().includes(q) ||
                (t.zone || "").toLowerCase().includes(q)
            );
        })
        : data;

    const start = (page - 1) * LIMIT + 1;
    const end = Math.min(page * LIMIT, total);

    return (
        <div className="tickets-page">
            {/* Header */}
            <div className="tickets-header">
                <div className="tickets-header-text">
                    <h1>Tickets Management</h1>
                    <p>Monitor infrastructure issues, track RPS scores, and manage repairs.</p>
                </div>
                <button className="btn-manual-ticket">+ Manual Ticket</button>
            </div>

            {/* Stats */}
            <TicketStats total={total} data={data} />

            {/* Table Card */}
            <div className="tickets-table-container">
                <TicketFilters
                    search={search}
                    onSearchChange={setSearch}
                    priority={priority}
                    onPriorityChange={handlePriorityChange}
                    status={status}
                    onStatusChange={handleStatusChange}
                />

                {loading ? (
                    <div className="loading-spinner" style={{ padding: "60px 0" }}>
                        <div className="spinner" />
                        Loading tickets...
                    </div>
                ) : (
                    <TicketTable tickets={filteredData} />
                )}

                {/* Footer */}
                <div className="tickets-footer">
                    <span className="tickets-showing">
                        {total > 0 ? `Showing ${start}-${end} of ${total.toLocaleString()} tickets` : "No tickets"}
                    </span>
                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
            </div>

            <div className="tickets-page-footer">
                © 2024 RoadNet.AI Infrastructure Monitoring. All rights reserved.
            </div>
        </div>
    );
}

export default Tickets;
