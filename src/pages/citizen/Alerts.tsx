import { useEffect, useState } from "react";
import { alertService } from "../../services/services";
import IntelligencePageLayout from "../../components/intelligence/IntelligencePageLayout";
import EmptyState from "../../components/ui/EmptyState";
import type { Alert } from "../../types/api";

interface AlertsPageProps {
  role: "citizen" | "authority";
}

export default function Alerts({ role }: AlertsPageProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAlerts = async () => {
      setLoading(true);
      try {
        const data = await alertService.list();
        setAlerts(data);
      } catch (err) {
        setError("Unable to load alerts.");
      } finally {
        setLoading(false);
      }
    };
    void loadAlerts();
  }, []);

  const backTo = role === "citizen" ? "/citizen" : "/authority";

  if (loading) return <IntelligencePageLayout title="Active Alerts" backTo={backTo}><p className="muted">Loading alerts...</p></IntelligencePageLayout>;
  if (error) return <IntelligencePageLayout title="Active Alerts" backTo={backTo}><p className="error">{error}</p></IntelligencePageLayout>;

  return (
    <IntelligencePageLayout title="Active Alerts" backTo={backTo}>
      {alerts.length > 0 ? (
        <div className="alerts-list">
          {alerts.map((alert) => (
            <section key={alert.id} className="card alert-card">
              <div className="alert-header">
                <h3>{alert.area}</h3>
                <span className={`badge badge-${alert.severity.toLowerCase()}`}>{alert.severity}</span>
              </div>
              <p>{alert.prediction}</p>
              <div className="alert-footer">
                <span className="muted">Confidence: {Math.round(alert.confidence * 100)}%</span>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState icon="🔔" title="No active alerts" description="Everything is looking good in your area." />
      )}
    </IntelligencePageLayout>
  );
}
