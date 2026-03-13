import { useRef, useState } from "react";

function VideoUploadPanel({ onUpload, isProcessing }) {
    const [activeTab, setActiveTab] = useState("upload");
    const [dragging, setDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            setSelectedFile(file);
            onUpload(file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            onUpload(file);
        }
    };

    return (
        <div className="insp-card">
            <div className="upload-tabs">
                <button
                    className={`upload-tab ${activeTab === "upload" ? "active" : ""}`}
                    onClick={() => setActiveTab("upload")}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Upload Video
                </button>
                <button
                    className={`upload-tab ${activeTab === "live" ? "active" : ""}`}
                    onClick={() => setActiveTab("live")}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                    Live Stream
                </button>
            </div>

            {activeTab === "upload" && (
                <>
                    <div
                        className={`upload-dropzone ${dragging ? "dragging" : ""}`}
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <svg className="upload-dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <p>Drag and drop dashcam footage or click to browse</p>
                        <p className="upload-hint">Supports MP4, AVI, MOV (Max 500MB)</p>
                        <button
                            className="upload-select-btn"
                            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                            disabled={isProcessing}
                        >
                            Select File
                        </button>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".mp4,.avi,.mov,.webm"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />

                    {selectedFile && (
                        <div className="upload-file-info">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                            {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)
                        </div>
                    )}

                    {isProcessing && (
                        <div className="upload-progress">
                            <div className="upload-progress-bar">
                                <div className="upload-progress-fill" style={{ width: "100%", animation: "pulse 1.5s infinite" }} />
                            </div>
                            <p className="upload-progress-text">Processing video with AI model...</p>
                        </div>
                    )}
                </>
            )}

            {activeTab === "live" && (
                <div className="inspection-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                    <p>Live stream integration coming soon</p>
                </div>
            )}
        </div>
    );
}

export default VideoUploadPanel;
