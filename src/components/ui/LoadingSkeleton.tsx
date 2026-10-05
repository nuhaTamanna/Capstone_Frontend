export default function LoadingSkeleton({ height = "1rem", width = "100%", className = "" }: { height?: string; width?: string; className?: string }) {
  return <div className={`skeleton ${className}`} style={{ height, width }} />;
}

export function CardSkeleton() {
  return (
    <article className="card skeleton-card">
      <LoadingSkeleton height="1.5rem" width="60%" />
      <LoadingSkeleton height="2.5rem" width="40%" className="mt-2" />
      <LoadingSkeleton height="1rem" width="80%" className="mt-2" />
    </article>
  );
}

export function MetricGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <section className="metric-grid">
      {Array.from({ length: count }).map((_, i) => (
        <article key={i} className="metric skeleton">
          <LoadingSkeleton height="1rem" width="40%" />
          <LoadingSkeleton height="2rem" width="30%" className="mt-2" />
        </article>
      ))}
    </section>
  );
}
