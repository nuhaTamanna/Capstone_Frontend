import { useEffect, useState } from "react";
import StatusCard from "../../components/ui/StatusCard";
import AIExplanation from "../../components/ui/AIExplanation";
import IntelligencePageLayout from "../../components/intelligence/IntelligencePageLayout";
import EmptyState from "../../components/ui/EmptyState";
import { mapService, predictionService } from "../../services/services";
import type { Prediction, TrendPoint } from "../../types/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AirQualityPageProps {
  role: "citizen" | "authority";
}

export default function AirQuality({ role }: AirQualityPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [prediction, setPrediction] = useState<Prediction>();
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);

  useEffect(() => {
    const loadAirQualityData = async () => {
      setLoading(true);
      setError("");
      try {
        const overview = await mapService.overview();
        setTrendData(overview.pollution_trend);

        // Get prediction for the first location or a default location
        const locationName = overview.locations[0]?.name || "Hyderabad";
        const pred = await predictionService.location(locationName);
        setPrediction(pred);
      } catch (err) {
        setError("Unable to load air quality data.");
      } finally {
        setLoading(false);
      }
    };

    void loadAirQualityData();
  }, []);

  const backTo = role === "citizen" ? "/citizen" : "/authority";

  if (loading) {
    return (
      <IntelligencePageLayout title="Air Quality Intelligence" backTo={backTo}>
        <p className="muted">Loading air quality data…</p>
      </IntelligencePageLayout>
    );
  }

  if (error) {
    return (
      <IntelligencePageLayout title="Air Quality Intelligence" backTo={backTo}>
        <p className="error">{error}</p>
      </IntelligencePageLayout>
    );
  }

  // Convert trend data for Recharts
  const chartData = trendData.map((point) => ({
    label: point.label,
    value: point.value,
  }));

  return (
    <IntelligencePageLayout title="Air Quality Intelligence" backTo={backTo}>
      {/* Current Status */}
      {prediction && (
        <section className="card">
          <h2>Current Status</h2>
          <StatusCard
            title="Air Quality"
            status={prediction.pollution_status}
            value={prediction.pollution_status}
            subtitle={`Last updated: ${new Date(prediction.prediction_time).toLocaleString()}`}
            icon="🌫️"
          />
        </section>
      )}

      {/* Trend */}
      {trendData.length > 0 ? (
        <section className="card">
          <h2>AQI Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="label" stroke="#61736d" fontSize={12} />
              <YAxis stroke="#61736d" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #dce7e1",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#28a779"
                strokeWidth={2}
                dot={{ fill: "#28a779", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </section>
      ) : (
        <EmptyState icon="📊" title="No trend data" description="AQI trend data is not available at this time." />
      )}

      {/* Prediction */}
      {prediction && prediction.feature_contributions && prediction.feature_contributions.length > 0 ? (
        <section className="card">
          <EmptyState icon="🔮" title="Detailed Timeline Pending" description="The current API provides a single prediction point. Multi-point timeline will be available once the backend is updated." />
        </section>
      ) : (
        <EmptyState icon="🔮" title="Prediction unavailable" description="AQI prediction data is not available at this time." />
      )}

      {/* Explanation */}
      {prediction && prediction.feature_contributions && prediction.feature_contributions.length > 0 ? (
        <section className="card">
          <AIExplanation
            title="Why is AQI at this level?"
            factors={prediction.feature_contributions}
            mainFactor={prediction.main_factors[0] || "Unknown"}
          />
        </section>
      ) : (
        <EmptyState icon="🤖" title="Explanation unavailable" description="AI explanation data is not available at this time." />
      )}

      {/* Operational section (Authority only) */}
      {role === "authority" && prediction && (
        <section className="card">
          <h2>Operational Information</h2>
          <div className="operational-grid">
            <div>
              <span className="operational-label">Affected Zone</span>
              <b>{prediction.location}</b>
            </div>
            <div>
              <span className="operational-label">Predicted Severity</span>
              <b>{prediction.severity}</b>
            </div>
            <div>
              <span className="operational-label">Confidence</span>
              <b>{Math.round(prediction.confidence * 100)}%</b>
            </div>
            <div>
              <span className="operational-label">Prediction Time</span>
              <b>{new Date(prediction.prediction_time).toLocaleString()}</b>
            </div>
          </div>
          {prediction.explanation && (
            <div style={{ marginTop: "16px" }}>
              <span className="operational-label">Explanation</span>
              <p>{prediction.explanation}</p>
            </div>
          )}
        </section>
      )}
    </IntelligencePageLayout>
  );
}
