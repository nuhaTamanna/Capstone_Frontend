import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface IntelligencePageLayoutProps {
  title: string;
  backTo: string;
  children: ReactNode;
}

export default function IntelligencePageLayout({ title, backTo, children }: IntelligencePageLayoutProps) {
  return (
    <>
      <Link to={backTo} className="button text" style={{ marginBottom: "16px", display: "inline-block" }}>
        ← Back
      </Link>
      <header className="page-header">
        <p className="eyebrow">INTELLIGENCE</p>
        <h1>{title}</h1>
      </header>
      {children}
    </>
  );
}
