import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface MetricCardProps {
  label: string;
  value: ReactNode;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: ReactNode;
  highlight?: boolean;
  to?: string; // If provided, makes the card clickable
  footerHint?: string; // Optional hint text like "View traffic intelligence"
}

export default function MetricCard({ label, value, subtitle, trend, trendValue, icon, highlight = false, to, footerHint }: MetricCardProps) {
  const content = (
    <>
      {icon && <div className="metric-icon">{icon}</div>}
      <div className="metric-content">
        <span className="metric-label">{label}</span>
        <div className="metric-value">{value}</div>
        {subtitle && <span className="metric-subtitle">{subtitle}</span>}
        {trend && trendValue && (
          <span className={`metric-trend ${trend}`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
          </span>
        )}
        {footerHint && <span className="metric-footer-hint">{footerHint}</span>}
        {to && <span className="metric-arrow">→</span>}
      </div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`metric-card ${highlight ? "highlight" : ""} clickable`}>
        {content}
      </Link>
    );
  }

  return (
    <article className={`metric-card ${highlight ? "highlight" : ""}`}>
      {content}
    </article>
  );
}
