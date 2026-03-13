import { useState } from "react";
import API from "../services/api";
import VideoUploadPanel from "../components/VideoUploadPanel";
import DetectionSummary from "../components/DetectionSummary";
import DetectionStats from "../components/DetectionStats";
import DetectedFramesGrid from "../components/DetectedFramesGrid";
import InspectionDetectionTable from "../components/InspectionDetectionTable";
import ActionButtons from "../components/ActionButtons";
import "../styles/AIInspection.css";

function AIInspection() {
    const [detections, setDetections] = useState([]);
    const [typeCounts, setTypeCounts] = useState({});
    const [framesProcessed, setFramesProcessed] = useState(0);
    const [avgConfidence, setAvgConfidence] = useState(0);
    const [ticketsCreated, setTicketsCreated] = useState(0);
    const [gpuUsage, setGpuUsage] = useState(0);
    const [processingTime, setProcessingTime] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasResults, setHasResults] = useState(false);

    const handleUpload = async (file) => {
        setIsProcessing(true);
        setHasResults(false);
        setDetections([]);
        setTicketsCreated(0);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await API.post("/inspection/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                timeout: 600000,
            });

            const data = res.data;
            setDetections(data.detections || []);
            setTypeCounts(data.type_counts || {});
            setFramesProcessed(data.frames_processed || 0);
            setAvgConfidence(data.avg_confidence || 0);
            setTicketsCreated(data.tickets_created || 0);
            setGpuUsage(data.gpu_usage || 0);
            setProcessingTime(data.processing_time_sec || 0);
            
            setHasResults(true);
        } catch (err) {
            console.error("Upload error:", err);
            alert("Error processing video. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleGenerateTickets = async () => {
        if (!detections.length) return;
        setIsGenerating(true);

        try {
            const res = await API.post("/inspection/generate-tickets", {
                detections: detections,
            });
            alert(`${res.data.message}`);
            setTicketsCreated((prev) => prev + (res.data.tickets_created || 0));
        } catch (err) {
            console.error("Ticket generation error:", err);
            alert("Error generating tickets.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleExportCSV = () => {
        if (!detections.length) return;

        const headers = ["Timestamp", "Issue Type", "Confidence", "Severity", "Frame ID", "Suggested Action"];
        const rows = detections.map(d => [
            d.timestamp,
            d.issue_type,
            (d.confidence * 100).toFixed(1) + "%",
            d.severity,
            d.frame_id,
            d.suggested_action,
        ]);

        const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "inspection_detections.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="ai-inspection">
            <h1>AI Inspection</h1>
            <p className="page-subtitle">Upload dashcam footage for automated road infrastructure analysis</p>

            {/* Section 1: Upload + Summary */}
            <div className="inspection-top-row">
                <VideoUploadPanel onUpload={handleUpload} isProcessing={isProcessing} />
                <DetectionSummary typeCounts={typeCounts} total={detections.length} />
            </div>

            {/* Loading */}
            {isProcessing && (
                <div className="inspection-loading">
                    <div className="spinner" />
                    <p>Running AI inference on video frames...</p>
                </div>
            )}

            {/* Success banner */}
            {hasResults && !isProcessing && ticketsCreated > 0 && (
                <div className="inspection-success-banner">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>
                        <strong>{ticketsCreated} tickets</strong> automatically created and saved to the database with detection frames.
                    </span>
                </div>
            )}

            {/* Results sections */}
            {hasResults && !isProcessing && (
                <>
                    {/* Section 2: Stats */}
                    <DetectionStats
                        framesProcessed={framesProcessed}
                        issuesDetected={detections.length}
                        avgConfidence={avgConfidence}
                        gpuUsage={gpuUsage}
                        processingTime={processingTime}
                    />

                    {/* Section 3: Frames Grid */}
                    <DetectedFramesGrid detections={detections} />

                    {/* Section 4: Detection Table */}
                    <InspectionDetectionTable detections={detections} />

                    {/* Section 5: Action Buttons */}
                    <ActionButtons
                        detections={detections}
                        onGenerateTickets={handleGenerateTickets}
                        isGenerating={isGenerating}
                        onExportCSV={handleExportCSV}
                    />
                </>
            )}

            {/* Empty state */}
            {!hasResults && !isProcessing && (
                <div className="inspection-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2" y="2" width="20" height="20" rx="2" />
                        <path d="M7 12h10M7 8h6M7 16h8" />
                    </svg>
                    <p>Upload a video to start AI inspection</p>
                </div>
            )}
        </div>
    );
}

export default AIInspection;

