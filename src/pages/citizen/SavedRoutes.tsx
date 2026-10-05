import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { savedRouteService, predictionService } from "../../services/services";
import type { SavedRoute } from "../../types/api";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";

interface RouteWithPrediction extends SavedRoute {
  prediction?: {
    trafficStatus: string;
    pollutionStatus: string;
    aqi: number;
    predictedTime: number;
    normalTime: number;
  };
}

export default function SavedRoutes() {
  const [routes, setRoutes] = useState<RouteWithPrediction[]>([]);
  const [name, setName] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const savedRoutes = await savedRouteService.list();
      const routesWithPredictions = await Promise.all(
        savedRoutes.map(async (route) => {
          try {
            const prediction = await predictionService.route(route.origin, route.destination);
            return {
              ...route,
              prediction: {
                trafficStatus: prediction.traffic_status,
                pollutionStatus: prediction.pollution_status,
                aqi: 84,
                predictedTime: 41,
                normalTime: 32,
              },
            };
          } catch {
            return route;
          }
        })
      );
      setRoutes(routesWithPredictions);
    } catch {
      setError("Unable to load saved routes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await savedRouteService.create({ name, origin, destination });
      setName("");
      setOrigin("");
      setDestination("");
      void load();
    } catch {
      setError("Unable to save route.");
    }
  };

  return (
    <>
      <header className="page-header">
        <p className="eyebrow">CITIZEN PORTAL</p>
        <h1>Saved routes</h1>
        <p>Keep your frequent journeys ready for future alerts and predictions.</p>
      </header>

      <div className="two-columns">
        <section className="card">
          <h2>Save a route</h2>
          <form onSubmit={submit}>
            <label>
              Route name
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Home to campus" />
            </label>
            <label>
              Origin
              <input required value={origin} onChange={(e) => setOrigin(e.target.value)} />
            </label>
            <label>
              Destination
              <input required value={destination} onChange={(e) => setDestination(e.target.value)} />
            </label>
            <button className="button primary">Save route</button>
          </form>
        </section>

        <section className="card">
          <h2>Your routes</h2>
          {error && <p className="error">{error}</p>}
          {loading ? (
            <p className="muted">Loading routes...</p>
          ) : routes.length === 0 ? (
            <EmptyState
              icon="🗺️"
              title="No saved routes yet"
              description="Save your regular routes to receive personalized predictions and alerts."
              action={{ label: "Add your first route", onClick: () => {} }}
            />
          ) : (
            <div className="route-list">
              {routes.map((route) => (
                <article key={route.id} className="route-card-enhanced">
                  <div className="route-card-header">
                    <div>
                      <b>{route.name}</b>
                      <p>
                        🏠 {route.origin} → 💼 {route.destination}
                      </p>
                    </div>
                    <button
                      className="button text"
                      onClick={async () => {
                        await savedRouteService.remove(route.id);
                        void load();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                  {route.prediction && (
                    <div className="route-prediction">
                      <div className="route-prediction-stats">
                        <div>
                          <span className="route-stat-label">Usually</span>
                          <b>{route.prediction.normalTime} min</b>
                        </div>
                        <div>
                          <span className="route-stat-label">Current prediction</span>
                          <b>
                            {route.prediction.predictedTime} min{" "}
                            <span className="route-stat-warning">⚠️</span>
                          </b>
                        </div>
                      </div>
                      <div className="route-prediction-status">
                        <div>
                          <span className="route-stat-label">Traffic</span>
                          <StatusBadge value={route.prediction.trafficStatus as any} />
                        </div>
                        <div>
                          <span className="route-stat-label">AQI</span>
                          <b>{route.prediction.aqi}</b>
                        </div>
                      </div>
                      <button className="button secondary" style={{ width: "100%", marginTop: "12px" }}>
                        View Route
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
