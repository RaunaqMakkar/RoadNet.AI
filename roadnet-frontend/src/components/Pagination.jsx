function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 3;

    for (let i = 1; i <= Math.min(maxVisible, totalPages); i++) {
        pages.push(i);
    }

    if (totalPages > maxVisible + 1) {
        pages.push("...");
    }
    if (totalPages > maxVisible && !pages.includes(totalPages)) {
        pages.push(totalPages);
    }

    return (
        <div className="pagination">
            <button className="page-btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            </button>

            {pages.map((p, i) =>
                p === "..." ? (
                    <span className="page-ellipsis" key={`e${i}`}>…</span>
                ) : (
                    <button
                        key={p}
                        className={`page-btn${page === p ? " active" : ""}`}
                        onClick={() => onPageChange(p)}
                    >
                        {p}
                    </button>
                )
            )}

            <button className="page-btn" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
        </div>
    );
}

export default Pagination;
