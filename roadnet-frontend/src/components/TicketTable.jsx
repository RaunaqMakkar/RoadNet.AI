import TicketRow from "./TicketRow";

function TicketTable({ tickets }) {
    if (!tickets || tickets.length === 0) {
        return <div className="tickets-empty">No tickets found.</div>;
    }

    return (
        <table className="tickets-table">
            <thead>
                <tr>
                    <th>TICKET ID</th>
                    <th>ISSUE TYPE</th>
                    <th>PRIORITY</th>
                    <th>RPS SCORE</th>
                    <th>ZONE</th>
                    <th>DEPT.</th>
                    <th>STATUS</th>
                    <th>TIMESTAMP</th>
                    <th>VERIFIED</th>
                    <th>ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {tickets.map((t, i) => (
                    <TicketRow key={t.ticket_id || i} ticket={t} />
                ))}
            </tbody>
        </table>
    );
}

export default TicketTable;
