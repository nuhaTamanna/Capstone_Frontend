import { useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import MetricCard from "../../components/ui/MetricCard";
import PredictionTimeline from "../../components/ui/PredictionTimeline";

interface Zone {
  id: string;
  name: string;
  trafficStatus: string;
  pollutionStatus: string;
  aqi: number;
  severity: string;
  activeAlerts: number;
}

export default function Zones() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const zones: Zone[] = [
    {
      id: "1",
      name: "Gachibowli",
      trafficStatus: "High",
      pollutionStatus: "Moderate",
      aqi: 135,
      severity: "High",
      activeAlerts: 2,
    },
    {
      id: "2",
      name: "Madhapur",
      trafficStatus: "Critical",
      pollutionStatus: "High",
      aqi: 168,
      severity: "Critical",
      activeAlerts: 4,
    },
    {
      id: "3",
      name: "Hitech City",
      trafficStatus: "Moderate",
      pollutionStatus: "Moderate",
      aqi: 118,
      severity: "Moderate",
      activeAlerts: 1,
    },
    {
      id: "4",
      name: "Banjara Hills",
      trafficStatus: "Low",
      pollutionStatus: "Low",
      aqi: 82,
      severity: "Low",
      activeAlerts: 0,
    },
    {
      id: "5",
      name: "Jubilee Hills",
      trafficStatus: "Moderate",
      pollutionStatus: "Low",
      aqi: 95,
      severity: "Moderate",
      activeAlerts: 1,
    },
  ];

  const getSeverityClass = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "critical";
      case "high":
        return "high";
      case "moderate":
        return "moderate";
      case "low":
        return "low";
      default:
        return "low";
    }
  };

  return (
    <>
      <header className="page-header">
        <p className="eyebrow">AUTHORITY PORTAL</p>
        <h1>Zones & Areas</h1>
        <p>Monitor and manage conditions across all monitored zones in the city.</p>
      </header>

      <section className="metric-grid">
        <MetricCard label="Total Zones" value={zones.length} icon="🗺️" />
        <MetricCard
          label="Critical Zones"
          value={zones.filter((z) => z.severity === "Critical").length}
          subtitle="Immediate attention"
          icon="🔴"
          highlight={zones.filter((z) => z.severity === "Critical").length > 0}
        />
        <MetricCard
          label="High Priority"
          value={zones.filter((z) => z.severity === "High").length}
          subtitle="Monitor closely"
          icon="🟠"
        />
        <MetricCard
          label="Stable Zones"
          value={zones.filter((z) => z.severity === "Low").length}
          subtitle="Normal conditions"
          icon="🟢"
        />
      </section>

      {!selectedZone ? (
        <section className="zone-list">
          {zones.map((zone) => (
            <article
              key={zone.id}
              className={`zone-card ${getSeverityClass(zone.severity)}`}
              onClick={() => setSelectedZone(zone)}
            >
              <div className="zone-name">
                <span className={`zone-indicator ${getSeverityClass(zone.severity)}`} />
                {zone.name}
              </div>
              <div className="zone-status">
                <div>
                  Traffic: <StatusBadge value={zone.trafficStatus as any} />
                </div>
                <div>
                  AQI: <b>{zone.aqi}</b>
                </div>
                <div>
                  Alerts: <b>{zone.activeAlerts}</b>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <>
          <button className="button secondary" onClick={() => setSelectedZone(null)}>
            ← Back to Zones
          </button>

          <section className="card">
            <div className="section-heading">
              <h2>{selectedZone.name}</h2>
              <StatusBadge value={selectedZone.severity as any} />
            </div>

            <section className="metric-grid">
              <MetricCard
                label="Traffic Status"
                value={selectedZone.trafficStatus}
                icon="🚗"
              />
              <MetricCard
                label="Pollution Status"
                value={selectedZone.pollutionStatus}
                icon="🌫️"
              />
              <MetricCard label="Current AQI" value={selectedZone.aqi} icon="🌤️" />
              <MetricCard
                label="Active Alerts"
                value={selectedZone.activeAlerts}
                icon="🔔"
                highlight={selectedZone.activeAlerts > 0}
              />
            </section>

            <PredictionTimeline
              title="Traffic Prediction - Next 4 Hours"
              data={[
                { label: "Now", value: selectedZone.trafficStatus === "Critical" ? 92 : 72, status: selectedZone.trafficStatus as any },
                { label: "+1h", value: 85, status: "High" },
                { label: "+2h", value: 78, status: "Moderate" },
                { label: "+3h", value: 65, status: "Moderate" },
              ]}
            />

            <section className="card">
              <h3>Active Alerts</h3>
              {selectedZone.activeAlerts > 0 ? (
                <div className="area-list">
                  {[...Array(selectedZone.activeAlerts)].map((_, i) => (
                    <article key={i} className="priority-alert">
                      <div className="priority-alert-header">
                        <StatusBadge value={i === 0 ? "Critical" : "High"} />
                        <b>Alert #{selectedZone.id}-${i + 1}</b>
                      </div>
                      <p>
                        {i === 0
                          ? "High pollution levels predicted in the next hour"
                          : "Traffic congestion expected during peak hours"}
                      </p>
                      <div className="priority-alert-actions">
                        <Link to={`/authority/alerts/${selectedZone.id}-${i + 1}`} className="button secondary">
                          View Details
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="muted">No active alerts for this zone.</p>
              )}
            </section>
          </section>
        </>
      )}
    </>
  );
}
