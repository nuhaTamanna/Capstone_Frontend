import { useCallback, useEffect, useRef, useState } from "react";
import { mapService, predictionService, dashboardService } from "../../services/services";
import type { GeographyOption, MapLocation, MapOverview, Prediction, AuthorityDashboard as Dashboard } from "../../types/api";
import MetricCard from "../../components/ui/MetricCard";
import GlobalSearch from "../../components/ui/GlobalSearch";
import GeographySelector, { type GeographicScope } from "../../components/map/GeographySelector";
import MapStatusPopup from "../../components/map/MapStatusPopup";
import UrbanMap from "../../components/map/UrbanMap";

export default function AuthorityDashboard() {
  const [overview, setOverview] = useState<MapOverview>();
  const [dashboardData, setDashboardData] = useState<Dashboard>();
  const [geographies, setGeographies] = useState<GeographyOption[]>([]);
  const [selected, setSelected] = useState<MapLocation>();
  const [prediction, setPrediction] = useState<Prediction>();
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [error, setError] = useState("");
  
  const scopeRequestId = useRef(0);
  const predictionRequestId = useRef(0);

  useEffect(() => {
    Promise.all([
      mapService.overview(),
      mapService.geographies(),
      dashboardService.authority(),
    ])
      .then(([mapData, options, dashData]) => {
        setOverview(mapData);
        setGeographies(options);
        setDashboardData(dashData);
      })
      .catch(() => setError("Unable to load command center. Ensure the FastAPI server is running."));
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
  if (!overview || !dashboardData) return <p className="muted">Loading command center…</p>;

  return (
    <>
      <header className="page-header">
        <p className="eyebrow">AUTHORITY PORTAL</p>
        <h1>Command Center</h1>
        <p>Monitor urban conditions, detect emerging risks, and coordinate responses.</p>
      </header>

      <GeographySelector options={geographies} onChange={changeScope} />

      <GlobalSearch />

      <section className="metric-grid">
        <MetricCard
          label="Traffic"
          value={dashboardData.areas.length > 0 ? dashboardData.areas[0].traffic_status : "--"}
          to="/authority/traffic"
          footerHint="View traffic intelligence"
          icon="🚗"
        />
        <MetricCard
          label="Air Quality"
          value={`AQI ${overview.status.average_aqi || "--"}`}
          to="/authority/air-quality"
          footerHint="View air quality intelligence"
          icon="🌫️"
        />
        <MetricCard
          label="Active Alerts"
          value={dashboardData.active_alerts}
          subtitle="Requiring attention"
          to="/authority/alerts"
          footerHint="View alerts"
          icon="🔔"
          highlight={dashboardData.active_alerts > 0}
        />
        <MetricCard
          label="Critical Zones"
          value={dashboardData.critical_areas}
          subtitle="Immediate action needed"
          to="/authority/zones"
          footerHint="View zones"
          icon="⚠️"
          highlight={dashboardData.critical_areas > 0}
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
              <p className="muted">Traffic, pollution hotspots, critical areas, and alerts</p>
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
                  authority={true}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
