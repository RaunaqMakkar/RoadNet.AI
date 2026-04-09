import { useState } from "react";
import API from "../services/api";
import { showToast } from "../components/ToastContainer";
import VideoUploadPanel from "../components/VideoUploadPanel";
import DetectionSummary from "../components/DetectionSummary";
import DetectionStats from "../components/DetectionStats";
import DetectedFramesGrid from "../components/DetectedFramesGrid";
import InspectionDetectionTable from "../components/InspectionDetectionTable";
import ActionButtons from "../components/ActionButtons";
import "../styles/AIInspection.css";

const PROCESSING_STEPS = [
    { label: "Uploading video file...", icon: "upload" },
    { label: "Extracting video frames...", icon: "frames" },
    { label: "Running YOLOv8 inference...", icon: "ai" },
    { label: "Analyzing detections...", icon: "analyze" },
    { label: "Generating tickets...", icon: "ticket" },
];

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
    const [processingStep, setProcessingStep] = useState(0);
    const [ticketSuccess, setTicketSuccess] = useState(false);

    const handleUpload = async (file) => {
        setIsProcessing(true);
        setHasResults(false);
        setDetections([]);
        setTicketsCreated(0);
        setTicketSuccess(false);
        setProcessingStep(0);

        showToast(`Uploading ${file.name}...`, "info", 4000);

        // Simulate processing steps for visual feedback
        const stepInterval = setInterval(() => {
            setProcessingStep((prev) => {
                if (prev < PROCESSING_STEPS.length - 1) return prev + 1;
                return prev;
            });
        }, 2500);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await API.post("/inspection/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                timeout: 600000,
            });

            clearInterval(stepInterval);

            const data = res.data;
            setDetections(data.detections || []);
            setTypeCounts(data.type_counts || {});
            setFramesProcessed(data.frames_processed || 0);
            setAvgConfidence(data.avg_confidence || 0);
            setTicketsCreated(data.tickets_created || 0);
            setGpuUsage(data.gpu_usage || 0);
            setProcessingTime(data.processing_time_sec || 0);

            setHasResults(true);

            const totalDetections = (data.detections || []).length;
            if (totalDetections > 0) {
                showToast(`✔ ${totalDetections} issues detected across ${data.frames_processed || 0} frames`, "success", 4000);
            } else {
                showToast("No issues detected in this video", "info", 3000);
            }

            if (data.tickets_created > 0) {
                showToast(`✔ ${data.tickets_created} tickets auto-generated`, "success", 4000);
            }
        } catch (err) {
            clearInterval(stepInterval);
            console.error("Upload error:", err);
            showToast("Error processing video. Please try again.", "error", 5000);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleGenerateTickets = async () => {
        if (!detections.length) return;
        setIsGenerating(true);
        setTicketSuccess(false);

        showToast("Generating tickets from detections...", "info", 3000);

        try {
            const res = await API.post("/inspection/generate-tickets", {
                detections: detections,
            });
            setTicketsCreated((prev) => prev + (res.data.tickets_created || 0));
            setTicketSuccess(true);
            showToast(`✔ ${res.data.tickets_created || 0} tickets generated successfully`, "success", 4000);
        } catch (err) {
            console.error("Ticket generation error:", err);
            showToast("Error generating tickets. Please try again.", "error", 5000);
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

        showToast("✔ CSV exported successfully", "success", 3000);
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

            {/* Enhanced Processing State */}
            {isProcessing && (
                <div className="inspection-processing">
                    <div className="processing-card">
                        <div className="processing-header">
                            <div className="processing-spinner" />
                            <h3>Processing Video</h3>
                        </div>
                        <div className="processing-steps">
                            {PROCESSING_STEPS.map((step, i) => (
                                <div
                                    key={i}
                                    className={`processing-step ${i < processingStep ? "done" : ""} ${i === processingStep ? "active" : ""} ${i > processingStep ? "pending" : ""}`}
                                >
                                    <div className="processing-step-indicator">
                                        {i < processingStep ? (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="14" height="14">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        ) : i === processingStep ? (
                                            <div className="step-pulse" />
                                        ) : (
                                            <div className="step-dot" />
                                        )}
                                    </div>
                                    <span>{step.label}</span>
                                </div>
                            ))}
                        </div>
                        <div className="processing-bar">
                            <div
                                className="processing-bar-fill"
                                style={{ width: `${((processingStep + 1) / PROCESSING_STEPS.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Detection Summary Feedback */}
            {hasResults && !isProcessing && detections.length > 0 && (
                <div className="detection-feedback">
                    <div className="detection-feedback-card">
                        <div className="feedback-icon success">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <div className="feedback-content">
                            <h3>✔ {detections.length} issues detected</h3>
                            <div className="feedback-breakdown">
                                {Object.entries(typeCounts).map(([type, count]) => (
                                    <span key={type} className={`feedback-tag ${type}`}>
                                        {type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}: {count}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Ticket Generation Success */}
            {ticketSuccess && (
                <div className="ticket-success-panel">
                    <div className="ticket-success-items">
                        <div className="ticket-success-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" width="16" height="16">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>Tickets generated successfully</span>
                        </div>
                        <div className="ticket-success-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" width="16" height="16">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>Stored in database</span>
                        </div>
                        <div className="ticket-success-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" width="16" height="16">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>Available in Tickets & Map</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Success banner (automatic ticket creation) */}
            {hasResults && !isProcessing && ticketsCreated > 0 && !ticketSuccess && (
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
