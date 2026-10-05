import { useState } from "react";
import MetricCard from "../../components/ui/MetricCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function Analytics() {
  const [location, setLocation] = useState("Gachibowli");
  const [period, setPeriod] = useState<"7d" | "30d">("7d");

  // Historical data for analytics (not current intelligence)
  const historicalTrafficData = [
    { week: "Week 1", predicted: 72, actual: 75 },
    { week: "Week 2", predicted: 68, actual: 70 },
    { week: "Week 3", predicted: 85, actual: 82 },
    { week: "Week 4", predicted: 78, actual: 80 },
  ];

  const historicalAQIData = [
    { week: "Week 1", predicted: 120, actual: 125 },
    { week: "Week 2", predicted: 135, actual: 130 },
    { week: "Week 3", predicted: 145, actual: 148 },
    { week: "Week 4", predicted: 128, actual: 132 },
  ];

  const zoneComparisonData = [
    { zone: "Gachibowli", traffic: 72, aqi: 135 },
    { zone: "Madhapur", traffic: 85, aqi: 168 },
    { zone: "Hitech City", traffic: 68, aqi: 118 },
    { zone: "Banjara Hills", traffic: 55, aqi: 82 },
  ];

  const hotspotFrequencyData = [
    { zone: "Madhapur", count: 12 },
    { zone: "Gachibowli", count: 8 },
    { zone: "Hitech City", count: 6 },
    { zone: "Banjara Hills", count: 3 },
  ];

  return (
    <>
      <header className="page-header">
        <p className="eyebrow">AUTHORITY PORTAL</p>
        <h1>Analytics</h1>
        <p>View historical trends, prediction accuracy, and zone comparisons over time.</p>
      </header>

      <div className="analytics-filters">
        <select
          className="analytics-filter"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="Gachibowli">Gachibowli</option>
          <option value="Madhapur">Madhapur</option>
          <option value="Hitech City">Hitech City</option>
          <option value="Banjara Hills">Banjara Hills</option>
        </select>
        <button
          className={`analytics-filter ${period === "7d" ? "active" : ""}`}
          onClick={() => setPeriod("7d")}
        >
          Last 7 days
        </button>
        <button
          className={`analytics-filter ${period === "30d" ? "active" : ""}`}
          onClick={() => setPeriod("30d")}
        >
          Last 30 days
        </button>
      </div>

      <section className="metric-grid">
        <MetricCard
          label="Prediction Accuracy"
          value="94%"
          subtitle="Traffic predictions"
          icon="�"
        />
        <MetricCard
          label="Prediction Accuracy"
          value="91%"
          subtitle="AQI predictions"
          icon="🎯"
        />
        <MetricCard
          label="Total Hotspots"
          value="29"
          subtitle="This period"
          icon="🔥"
        />
        <MetricCard
          label="Alerts Generated"
          value="24"
          subtitle="This period"
          icon="🔔"
        />
      </section>

      <div className="two-columns">
        <section className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Traffic Prediction Accuracy</h3>
            <div className="chart-legend">
              <div className="chart-legend-item">
                <div className="chart-legend-color" style={{ background: "#28a779" }} />
                <span>Predicted</span>
              </div>
              <div className="chart-legend-item">
                <div className="chart-legend-color" style={{ background: "#d75a28" }} />
                <span>Actual</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={historicalTrafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="week" stroke="#61736d" fontSize={12} />
              <YAxis stroke="#61736d" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #dce7e1",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#28a779"
                strokeWidth={2}
                dot={{ fill: "#28a779", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#d75a28"
                strokeWidth={2}
                dot={{ fill: "#d75a28", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">AQI Prediction Accuracy</h3>
            <div className="chart-legend">
              <div className="chart-legend-item">
                <div className="chart-legend-color" style={{ background: "#28a779" }} />
                <span>Predicted</span>
              </div>
              <div className="chart-legend-item">
                <div className="chart-legend-color" style={{ background: "#d75a28" }} />
                <span>Actual</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={historicalAQIData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="week" stroke="#61736d" fontSize={12} />
              <YAxis stroke="#61736d" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #dce7e1",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#28a779"
                strokeWidth={2}
                dot={{ fill: "#28a779", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#d75a28"
                strokeWidth={2}
                dot={{ fill: "#d75a28", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </section>
      </div>

      <section className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">Zone Comparison</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={zoneComparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="zone" stroke="#61736d" fontSize={12} />
            <YAxis stroke="#61736d" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #dce7e1",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="traffic" fill="#28a779" name="Traffic" radius={[4, 4, 0, 0]} />
            <Bar dataKey="aqi" fill="#d75a28" name="AQI" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">Hotspot Frequency</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={hotspotFrequencyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="zone" stroke="#61736d" fontSize={12} />
            <YAxis stroke="#61736d" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #dce7e1",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="count" fill="#bd3340" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </>
  );
}
