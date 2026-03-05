import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import MapContainerView from "../components/MapContainerView";
import MapModeToggle from "../components/MapModeToggle";
import MapLegend from "../components/MapLegend";
import MapFilters from "../components/MapFilters";
import "../styles/MapView.css";

const DEFAULT_FILTERS = {
    priorities: new Set(["Critical", "High"]),
    issueType: "",
    zone: "",
    department: "",
    verifiedOnly: false,
    dateFrom: "",
    dateTo: "",
};

function matchesPriority(feature, priorities) {
    if (priorities.size === 0) return true;
    const p = feature.properties?.priority || "";
    return priorities.has(p);
}

function matchesFilter(feature, filters) {
    const props = feature.properties || {};

    if (!matchesPriority(feature, filters.priorities)) return false;

    if (filters.issueType && props.type !== filters.issueType) return false;

    if (filters.zone && props.zone !== filters.zone) return false;

    if (filters.department && props.assigned_department !== filters.department) return false;

    if (filters.verifiedOnly && !props.is_verified) return false;

    if (filters.dateFrom) {
        const created = props.created_at ? new Date(props.created_at) : null;
        if (!created || created < new Date(filters.dateFrom)) return false;
    }

    if (filters.dateTo) {
        const created = props.created_at ? new Date(props.created_at) : null;
        const end = new Date(filters.dateTo);
        end.setHours(23, 59, 59, 999);
        if (!created || created > end) return false;
    }

    return true;
}

function MapView() {
    const [allFeatures, setAllFeatures] = useState([]);
    const [filteredFeatures, setFilteredFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mapMode, setMapMode] = useState("Standard");
    const [filters, setFilters] = useState(DEFAULT_FILTERS);

    useEffect(() => {
        API.get("/map/geojson")
            .then((res) => {
                const feats = res.data.features || [];
                setAllFeatures(feats);
            })
            .catch(() => setAllFeatures([]))
            .finally(() => setLoading(false));
    }, []);

    const applyFilters = useCallback(() => {
        const result = allFeatures.filter((f) => matchesFilter(f, filters));
        setFilteredFeatures(result);
    }, [allFeatures, filters]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const handleClear = () => {
        setFilters({
            priorities: new Set(),
            issueType: "",
            zone: "",
            department: "",
            verifiedOnly: false,
            dateFrom: "",
            dateTo: "",
        });
    };

    return (
        <div className="mapview-page">
            {/* Map Area */}
            <div className="mapview-map-area">
                {loading && (
                    <div className="map-loading-overlay">
                        <div className="spinner" />
                    </div>
                )}
                <MapContainerView features={filteredFeatures} />
                <MapModeToggle mode={mapMode} onChange={setMapMode} />
                <MapLegend />
            </div>

            {/* Filter Panel */}
            <MapFilters
                filters={filters}
                onChange={setFilters}
                onApply={applyFilters}
                onClear={handleClear}
                markerCount={filteredFeatures.length}
            />
        </div>
    );
}

export default MapView;
