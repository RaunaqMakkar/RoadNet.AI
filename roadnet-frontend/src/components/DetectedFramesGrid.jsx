const API_BASE = "http://127.0.0.1:8000";

function DetectedFramesGrid({ detections }) {
    if (!detections || detections.length === 0) return null;

    return (
        <div className="frames-section">
            <div className="frames-header">
                <div className="frames-header-left">
                    <h2>Detected Frames</h2>
                    <span className="frames-badge">{detections.length} Issues Detected</span>
                </div>
                <div className="frames-controls">
                    <button className="frames-control-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
                            <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
                            <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" />
                            <line x1="17" y1="16" x2="23" y2="16" />
                        </svg>
                        Filter
                    </button>
                    <button className="frames-control-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <path d="M11 5h10M11 9h7M11 13h4" />
                            <line x1="3" y1="5" x2="3" y2="5.01" />
                            <line x1="3" y1="9" x2="3" y2="9.01" />
                            <line x1="3" y1="13" x2="3" y2="13.01" />
                        </svg>
                        Newest
                    </button>
                </div>
            </div>

            <div className="frames-grid">
                {detections.map((det, i) => (
                    <div className="frame-card" key={i}>
                        <div className="frame-card-img">
                            <img
                                src={`${API_BASE}${det.image_url}`}
                                alt={det.issue_title}
                                loading="lazy"
                            />
                            <span className={`frame-tag ${det.issue_type}`}>
                                {det.issue_type.replace("_", " ").toUpperCase()} {(det.confidence * 100).toFixed(0)}%
                            </span>
                        </div>
                        <div className="frame-card-meta">
                            <div className="frame-meta-top">
                                <span className="frame-id">ID: {det.frame_id}</span>
                                <span className={`severity-tag ${det.severity.toLowerCase()}`}>
                                    {det.severity}
                                </span>
                            </div>
                            <div className="frame-title">{det.issue_title}</div>
                            <div className="frame-detail">
                                <span>Time: {det.timestamp}</span>
                                <span>Conf: {(det.confidence * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DetectedFramesGrid;
