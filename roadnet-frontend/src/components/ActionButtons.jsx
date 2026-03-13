function ActionButtons({ detections, onGenerateTickets, isGenerating, onExportCSV }) {
    const hasDetections = detections && detections.length > 0;

    return (
        <div className="action-buttons-row">
            <button
                className="action-btn-export"
                disabled={!hasDetections}
                onClick={onExportCSV}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export CSV
            </button>
            <button className="action-btn-map" disabled={!hasDetections}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
                Send to Map
            </button>
            <button
                className="action-btn-generate"
                disabled={!hasDetections || isGenerating}
                onClick={onGenerateTickets}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
                {isGenerating ? "Generating..." : "Generate Tickets"}
            </button>
        </div>
    );
}

export default ActionButtons;
