<p align="center">
  <h1 align="center">🛣️ RoadNet.AI</h1>
  <p align="center">
    <strong>AI-Powered Road Infrastructure Monitoring & Management Platform</strong>
  </p>
  <p align="center">
    Detect potholes, cracks, and open manholes from dashcam footage using YOLOv8 — with automated ticketing, priority scoring, predictive insights, and a real-time SaaS dashboard.
  </p>
</p>

<br>

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Environment Variables](#environment-variables)
- [AI Pipeline](#ai-pipeline)
  - [Detection Classes](#detection-classes)
  - [Frame Extraction & Cloud Upload](#frame-extraction--cloud-upload)
  - [RPS Scoring Engine](#rps-scoring-engine)
- [API Reference](#api-reference)
- [Dashboard Pages](#dashboard-pages)
- [Frontend Components](#frontend-components)
- [License](#license)

---

## Overview

**RoadNet.AI** is a full-stack SaaS platform that automates road infrastructure defect detection. Users upload dashcam or drone surveillance video, and the system runs a custom-trained **YOLOv8** model to detect road hazards frame-by-frame. Each detection is scored using a proprietary **Road Priority Score (RPS)** engine, automatically converted into a trackable maintenance ticket, and visualized on an interactive map and analytics dashboard.

The platform uses **local-only model management** — model weights are loaded directly from a local `weights/best.pt` file with no external download dependencies (HuggingFace, Google Drive, etc.). All annotated detection frames are uploaded to **Cloudinary** for cloud-hosted evidence storage, and the backend uses **structured logging** (no debug print statements) for clean, production-ready output.

The platform is designed for **municipal governments, public works departments, and road maintenance agencies** looking to replace manual road inspection with AI-driven monitoring.

---

## Features

| Category | Capability |
|---|---|
| **AI Detection** | YOLOv8-based object detection on video (potholes, cracks, manholes, open manholes) |
| **Frame Extraction** | Annotated bounding-box frames with unique run IDs, uploaded to Cloudinary for cloud-hosted evidence |
| **Priority Scoring** | Proprietary RPS engine factoring severity, area, duration, frequency, and confidence |
| **Auto-Ticketing** | Detected issues are automatically converted into structured maintenance tickets on upload |
| **Interactive Map** | Leaflet-based GeoJSON map with filters by priority, type, status, and zone |
| **Analytics Dashboard** | Charts for ticket trends, priority breakdowns, RPS trends, issue types over time |
| **Predictive Insights** | AI-driven hotspot alerts, resource optimization, and risk assessment based on live data |
| **Department Management** | Assign and track tickets across departments with workload visibility |
| **User Management** | Role-based user table (Admin, Dispatcher, Viewer) with invite and edit capabilities |
| **AI Inspection** | Dedicated page for uploading video, viewing frame-level detections, and auto-generating tickets |
| **Toast Notifications** | Real-time in-app notifications (success, error, warning, info) with auto-dismiss and progress bars |
| **Notification Settings** | Configurable system notifications — Email, SMS, and In-App toggles |
| **Alert Thresholds** | Configurable response latency and critical priority level thresholds |
| **Resource Allocation** | Live resource overview — active tickets, avg RPS, department workload distribution |
| **Responsive Design** | Fully responsive dark-themed UI optimized for desktop and mobile |
| **Production Logging** | Clean structured logging via Python `logging` module — no debug print statements |

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Python 3.10+** | Core runtime |
| **FastAPI** | Async REST API framework |
| **Uvicorn** | ASGI server |
| **Ultralytics YOLOv8** | Object detection model |
| **OpenCV** | Video processing & frame annotation |
| **PyTorch** | Deep learning inference engine |
| **Motor** | Async MongoDB driver |
| **MongoDB** | NoSQL database for tickets & analytics |
| **Cloudinary** | Cloud image storage for annotated detection frames |
| **Pydantic** | Request/response validation |
| **NumPy / SciPy** | Numerical computation |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite** | Build tool & dev server |
| **React Router v7** | Client-side routing |
| **Recharts** | Data visualization & charts |
| **Leaflet / React-Leaflet** | Interactive map rendering |
| **Axios** | HTTP client for API communication |
| **Vanilla CSS** | Custom styling with dark theme |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React + Vite)                  │
│  Dashboard │ Map │ Tickets │ Analytics │ Departments │ AI Insp. │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP (Axios)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FastAPI Backend (Uvicorn)                   │
│                                                                 │
│  Routes:  /detect  │  /tickets  │  /stats  │  /map  │ /inspect │
│                                                                 │
│  Services:                                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    AI Pipeline                           │   │
│  │  Video Upload → Frame Sampling → YOLOv8 Inference       │   │
│  │  → Frame Extraction & Annotation → Cloudinary Upload    │   │
│  │  → Detection Aggregation → RPS Scoring → Ticket Gen     │   │
│  │  → Auto-Insert to MongoDB                               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Logging: Python logging module (no debug prints)               │
│  Model:   Local-only weights/best.pt (no external downloads)    │
└───────────┬──────────────────────────────┬──────────────────────┘
            │                              │
            ▼                              ▼
     ┌─────────────┐              ┌────────────────┐
     │   MongoDB    │              │   Cloudinary   │
     │  (tickets,   │              │  (annotated    │
     │   analytics) │              │   frames)      │
     └─────────────┘              └────────────────┘
```

---

## Project Structure

```
RoadNet.AI/
├── weights/
│   └── best.pt                        # Pre-trained YOLOv8 model weights (local only)
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI app entrypoint
│   │   ├── config/
│   │   │   └── cloudinary_config.py   # Cloudinary credentials setup
│   │   ├── database/
│   │   │   └── mongodb.py             # Motor async MongoDB client
│   │   ├── routes/
│   │   │   ├── detect.py              # POST /detect — full pipeline
│   │   │   ├── inspection.py          # POST /inspection/upload — AI inspection + auto-ticketing
│   │   │   ├── tickets.py             # GET /tickets — paginated ticket listing
│   │   │   ├── stats.py               # GET /stats — dashboard statistics
│   │   │   └── map.py                 # GET /map/geojson — GeoJSON for map
│   │   └── services/
│   │       ├── ai_pipeline.py         # Orchestrates full + inspection pipelines
│   │       ├── video_processor.py     # Video → frame sampling → YOLO inference
│   │       ├── frame_extractor.py     # Frame extraction, annotation & Cloudinary upload
│   │       ├── cloudinary_service.py  # Cloudinary upload helper with validation
│   │       ├── aggregate_detections.py# IoU-based grouping of raw detections into issues
│   │       ├── rps_engine.py          # Road Priority Score computation
│   │       └── ticket_generator.py    # Creates structured ticket documents
│   ├── temp_uploads/                   # Temporary video storage (auto-cleaned)
│   ├── temp_frames/                    # Temporary frame storage (auto-cleaned)
│   ├── requirements.txt               # Python dependencies
│   └── .env                           # Environment variables (not committed)
│
├── roadnet-frontend/
│   ├── src/
│   │   ├── App.jsx                    # Root component with routing & toast provider
│   │   ├── main.jsx                   # Vite entry point
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx          # Main dashboard with KPIs, charts & predictive insights
│   │   │   ├── MapView.jsx            # Interactive Leaflet map
│   │   │   ├── Tickets.jsx            # Ticket management with filters
│   │   │   ├── Analytics.jsx          # Advanced analytics & trends
│   │   │   ├── Departments.jsx        # Department management, users, alerts & notifications
│   │   │   └── AIInspection.jsx       # Video upload, frame-level results & auto-ticketing
│   │   ├── components/                # 38 reusable UI components
│   │   │   ├── Navbar.jsx             # App navigation bar
│   │   │   ├── ToastContainer.jsx     # Global toast notification system
│   │   │   ├── PredictiveInsights.jsx # AI-driven hotspot & risk analysis
│   │   │   ├── NotificationSettings.jsx # Email/SMS/In-App notification toggles
│   │   │   ├── AlertThresholds.jsx    # Response latency & priority level config
│   │   │   ├── ResourceAllocation.jsx # Active tickets, RPS & department stats
│   │   │   ├── UserManagement.jsx     # Role-based user table with actions
│   │   │   ├── DetectedFramesGrid.jsx # Cloud-hosted detection frame gallery
│   │   │   ├── VideoUploadPanel.jsx   # Video upload with drag & drop
│   │   │   ├── MapContainerView.jsx   # Full map rendering with markers
│   │   │   ├── MapFilters.jsx         # Map filter controls
│   │   │   └── ...                    # 27 additional components
│   │   ├── services/
│   │   │   └── api.js                 # Axios instance (baseURL config)
│   │   └── styles/
│   │       ├── Dashboard.css          # Dashboard page styles
│   │       ├── AIInspection.css       # Inspection page styles
│   │       ├── Analytics.css          # Analytics page styles
│   │       ├── Departments.css        # Departments page styles
│   │       ├── MapView.css            # Map page styles
│   │       ├── Tickets.css            # Tickets page styles
│   │       └── Toast.css              # Toast notification styles
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **Python** 3.10 or higher
- **Node.js** 18+ and **npm**
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas) cloud cluster)
- **Cloudinary** account ([free tier](https://cloudinary.com/pricing) works)
- **YOLOv8 model weights** — place at `weights/best.pt` in the project root

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment variables (see section below)
# Edit backend/.env with your credentials

# 5. Start the API server
python -m uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`. Visit `http://127.0.0.1:8000/docs` for the interactive Swagger documentation.

> **Important:** The server will fail to start if `weights/best.pt` is not found. No automatic model downloading occurs — you must supply the weights file manually.

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd roadnet-frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The dashboard will be available at `http://localhost:5173`.

### Environment Variables

Create a `backend/.env` file with the following variables:

```env
# MongoDB
MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority

# Model Path (absolute path to your YOLOv8 weights)
MODEL_PATH=C:\path\to\weights\best.pt

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

| Variable | Description |
|---|---|
| `MONGO_URL` | MongoDB connection string (Atlas or local) |
| `MODEL_PATH` | Absolute path to the YOLOv8 `.pt` weights file |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name from dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

> **Note:** The `MODEL_PATH` variable in `.env` is informational. The backend resolves the model path relative to the project root at `../weights/best.pt`. Ensure the weights file exists at that location.

---

## AI Pipeline

The core pipeline processes video through multiple stages:

```
Video Upload
    │
    ▼
Frame Sampling (every 0.2s)
    │
    ▼
YOLOv8 Inference (conf ≥ 0.40)
    │
    ▼
Frame Extraction & Annotation
  (bounding boxes drawn with class-specific colors)
    │
    ▼
Cloudinary Upload
  (annotated frames stored in cloud with unique run IDs)
    │
    ▼
Detection Aggregation
  (IoU-based grouping of raw detections into distinct issues)
    │
    ▼
RPS Scoring Engine
  (compute severity & priority)
    │
    ▼
Ticket Generation
  (structured documents with image URLs stored in MongoDB)
    │
    ▼
Auto-Insert to MongoDB
  (tickets immediately available in the dashboard)
```

### Detection Classes

| Class | Color (BGR) | Weight | Description |
|---|---|---|---|
| `open_manhole` | Green | 1.0 | Missing/open manhole cover — highest hazard |
| `pothole` | Red | 0.8 | Deep asphalt pothole |
| `manhole` | Yellow | 0.6 | Standard manhole (logged for asset registry) |
| `road_crack` | Orange | 0.4 | Longitudinal/transverse cracking |

### Frame Extraction & Cloud Upload

The **Frame Extractor** service handles the complete frame-to-cloud pipeline:

1. **Re-opens** the source video and seeks to each unique detected frame
2. **Draws** all bounding boxes for that frame using class-specific colors
3. **Saves** annotated frames temporarily with a unique run ID prefix (`{run_id}_{frame_id}`)
4. **Uploads** to Cloudinary under the `roadnet_frames/` folder with `overwrite=True`
5. **Cleans up** local temp files immediately after upload
6. **Enriches** each detection with `image_url`, `frame_id`, `severity`, `timestamp`, and `suggested_action`

Each inference run generates a unique 8-character run ID to prevent Cloudinary public ID collisions across multiple uploads.

### RPS Scoring Engine

The **Road Priority Score (RPS)** is a composite metric (0–100) computed as:

```
R_final = clamp(R_raw × confidence_factor, 0, 100)
```

Where:

| Component | Formula | Weight |
|---|---|---|
| **Area Factor (A)** | `log(1 + area) / log(1 + max_area)` | Part of Severity |
| **Severity (S)** | `0.7 × A + 0.3 × class_weight` | 50% |
| **Time Factor (T)** | `1 - exp(-duration / 3)` | 20% |
| **Frequency Factor (F)** | `1 - exp(-frames / 5)` | 10% |
| **Class Weight (W)** | Lookup table per class | 20% |
| **Confidence Factor** | `0.5 + 0.5 × avg_confidence` | Multiplier |

**Priority Classification:**

| RPS Score | Priority | Recommended Action |
|---|---|---|
| ≥ 85 | 🔴 Critical | Immediate repair within 24 hours |
| ≥ 65 | 🟠 High | Repair within 3 days |
| ≥ 40 | 🟡 Moderate | Schedule maintenance |
| < 40 | 🟢 Low | Monitor condition |

---

## API Reference

### Detection

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/detect/` | Upload video → run full pipeline → create tickets |

### Inspection

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/inspection/upload` | Upload video → frame-level analysis → auto-create tickets → return results |
| `POST` | `/inspection/generate-tickets` | Convert detection results into tickets manually (fallback) |

**Upload Response Fields:** `frames_processed`, `total_detections`, `avg_confidence`, `type_counts`, `processing_time_sec`, `gpu_usage`, `tickets_created`, `detections[]`

### Tickets

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tickets/` | Paginated ticket listing with filters |

**Query Parameters:** `page`, `limit`, `priority`, `type`, `status`, `sort_by`, `order`

### Statistics

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/stats/` | Dashboard stats — totals, RPS averages, breakdowns |

### Map

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/map/geojson` | GeoJSON FeatureCollection for map markers |
| `GET` | `/map/` | Simplified map data (lat/lng + priority) |

**Query Parameters:** `priority`, `type`, `status`, `zone`, `assigned_department`, `is_verified`

---

## Dashboard Pages

| Page | Route | Description |
|---|---|---|
| **Dashboard** | `/` | KPI cards, priority breakdown charts, recent issues, map preview, predictive AI insights |
| **Map View** | `/map` | Full-screen interactive Leaflet map with filtering and GeoJSON layers |
| **Tickets** | `/tickets` | Filterable & sortable ticket table with pagination |
| **Analytics** | `/analytics` | Trend charts, RPS analysis, issue-over-time visualization |
| **Departments** | `/departments` | Department cards, workload tracking, user management, alert thresholds, notification settings |
| **AI Inspection** | `/inspection` | Video upload panel, real-time detection results, frame gallery with cloud-hosted images, auto-ticketing |

---

## Frontend Components

The frontend includes **38 reusable components** organized by feature area:

| Component | Description |
|---|---|
| `Navbar` | Responsive navigation bar with mobile hamburger menu |
| `ToastContainer` | Global toast notification system with 4 types (success, error, warning, info), auto-dismiss, and progress bars |
| `PredictiveInsights` | AI-driven insight cards — hotspot alerts, resource optimization, risk assessment |
| `NotificationSettings` | Toggle controls for Email, SMS, and In-App notifications |
| `AlertThresholds` | Response latency slider and critical priority level dropdown |
| `ResourceAllocation` | Active tickets, avg/max RPS score, and department workload stats |
| `UserManagement` | Role-based user table (Admin, Dispatcher, Viewer) with invite and edit actions |
| `DetectedFramesGrid` | Cloud-hosted annotated frame gallery with severity tags and confidence scores |
| `VideoUploadPanel` | Drag & drop video uploader with file validation and progress feedback |
| `MapContainerView` | Full Leaflet map renderer with clustered markers and popups |
| `MapFilters` | Multi-select filter controls for map data |
| `MapLegend` | Priority color legend for map markers |
| `KPICard` | Reusable KPI stat card with icon and label |
| `PriorityBreakdownChart` | Donut chart showing priority distribution |
| `TicketTrendChart` | Line chart for ticket creation trends over time |
| `RPSTrendChart` | Line chart for RPS score trends |
| `IssuesOverTimeChart` | Stacked area chart for issue types over time |
| `TicketFilters` | Multi-field filter panel for the tickets page |
| `TicketTable` | Sortable ticket table with row-level actions |
| `Pagination` | Reusable page navigation component |
| `DepartmentCards` | Department summary cards with ticket counts |
| `DepartmentWorkload` | Department workload progress bars |
| `ActiveAssignments` | Active assignment list with status tracking |

---

## License

This project is proprietary. All rights reserved.

---
