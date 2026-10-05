import { useCallback, useEffect, useRef, useState } from "react";
import { mapService, predictionService } from "../../services/services";
import type { GeographyOption, MapLocation, MapOverview, Prediction } from "../../types/api";
import MetricCard from "../../components/ui/MetricCard";
import GlobalSearch from "../../components/ui/GlobalSearch";
import GeographySelector, { type GeographicScope } from "../../components/map/GeographySelector";
import MapStatusPopup from "../../components/map/MapStatusPopup";
import UrbanMap from "../../components/map/UrbanMap";

export default function CitizenDashboard() {
  const [overview, setOverview] = useState<MapOverview>();
  const [geographies, setGeographies] = useState<GeographyOption[]>([]);
  const [selected, setSelected] = useState<MapLocation>();
  const [prediction, setPrediction] = useState<Prediction>();
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [error, setError] = useState("");
  
  const scopeRequestId = useRef(0);
  const predictionRequestId = useRef(0);

  useEffect(() => {
    Promise.all([mapService.overview(), mapService.geographies()])
      .then(([mapData, options]) => {
        setOverview(mapData);
        setGeographies(options);
      })
      .catch(() => setError("Unable to load urban intelligence. Ensure the FastAPI server is running."));
  }, []);

  const select = async (location: MapLocation) => {
    const requestId = ++predictionRequestId.current;
    setSelected(location);
    setPrediction(undefined);
    setLoadingPrediction(true);
    try {
      const data = await predictionService.location(location.name);
      if (requestId === predictionRequestId.current) setPrediction(data);
    } finally {
      if (requestId === predictionRequestId.current) setLoadingPrediction(false);
    }
  };

  const changeScope = useCallback((scope: GeographicScope) => {
    const requestId = ++scopeRequestId.current;
    ++predictionRequestId.current;
    setSelected(undefined);
    setPrediction(undefined);
    setLoadingPrediction(false);
    setError("");
    mapService
      .overview(scope)
      .then((data) => {
        if (requestId === scopeRequestId.current) {
          setOverview(data);
          if (scope.locality) setSelected(data.locations[0]);
        }
      })
      .catch(() => {
        if (requestId === scopeRequestId.current) setError("Unable to load the selected map area.");
      });
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!overview) return <p className="muted">Loading urban intelligence map…</p>;

  const aqiCategory = overview.status.average_aqi
    ? overview.status.average_aqi < 100
      ? "Good"
      : overview.status.average_aqi < 150
      ? "Moderate"
      : "Unhealthy"
    : "";

  return (
    <>
      <header className="page-header">
        <p className="eyebrow">CITIZEN PORTAL</p>
        <h1>Dashboard</h1>
        <p>Know your journey before you leave. Explore city conditions, then check a precise location or route.</p>
      </header>

      <GeographySelector options={geographies} onChange={changeScope} />

      <GlobalSearch />

      <section className="metric-grid">
        <MetricCard
          label="Traffic"
          value={overview.status.overall_traffic || "--"}
          to="/citizen/traffic"
          footerHint="View traffic intelligence"
          icon="🚗"
        />
        <MetricCard
          label="Air Quality"
          value={overview.status.average_aqi || "--"}
          subtitle={aqiCategory}
          to="/citizen/air-quality"
          footerHint="View air quality intelligence"
          icon="🌤️"
        />
        <MetricCard
          label="Active Alerts"
          value={overview.status.active_alerts || 0}
          subtitle="In your area"
          to="/citizen/alerts"
          footerHint="View alerts"
          icon="🔔"
        />
        <MetricCard
          label="Critical Areas"
          value={overview.status.critical_areas || 0}
          subtitle="Requiring attention"
          to="/citizen/zones"
          footerHint="View zones"
          icon="⚠️"
          highlight={overview.status.critical_areas ? overview.status.critical_areas > 0 : false}
        />
      </section>

      <section className="urban-intelligence">
        <div className="map-dashboard-grid">
          <div className="map-primary">
            <div className="map-title">
              <div>
                <p className="eyebrow">URBAN INTELLIGENCE MAP</p>
                <h2>Current city conditions</h2>
              </div>
              <p className="muted">Traffic, pollution and alerts across monitored areas</p>
            </div>
            <div className="urban-map">
              <UrbanMap 
                viewport={overview.viewport} 
                locations={overview.locations} 
                onSelect={select} 
              />
              {selected && (
                <MapStatusPopup
                  location={selected}
                  prediction={prediction}
                  loading={loadingPrediction}
                  authority={false}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
