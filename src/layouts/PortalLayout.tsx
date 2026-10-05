import { NavLink, Outlet } from "react-router-dom";
import CitizenQuickActions, { CitizenQueryProvider } from "../components/citizen/CitizenQuickActions";
import "./PortalLayout.css";

function PortalContents({ kind }: { kind: "citizen" | "authority" }) {
  const links =
    kind === "citizen"
      ? [
          ["/citizen", "Dashboard"],
          ["/citizen/traffic", "Traffic"],
          ["/citizen/air-quality", "Air Quality"],
          ["/citizen/my-commutes", "My Commutes"],
          ["/citizen/saved-routes", "Saved Routes"],
          ["/citizen/alerts", "Alerts"],
          ["/citizen/profile", "Profile"],
        ]
      : [
          ["/authority", "Command Center"],
          ["/authority/traffic", "Traffic"],
          ["/authority/air-quality", "Air Quality"],
          ["/authority/zones", "Zones"],
          ["/authority/alerts", "Alerts"],
          ["/authority/analytics", "Analytics"],
          ["/authority/profile", "Profile"],
        ];

  return (
    <div className="shell">
      <aside>
        <NavLink className="brand" to="/">
          URB<span>IQ</span>
        </NavLink>
        <p className="portal-label">{kind} portal</p>
        <nav>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === `/${kind}`}>
              {label}
            </NavLink>
          ))}
        </nav>
        {kind === "citizen" && <CitizenQuickActions />}
        <NavLink className="switch" to="/">
          Switch portal
        </NavLink>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default function PortalLayout({ kind }: { kind: "citizen" | "authority" }) {
  return kind === "citizen" ? (
    <CitizenQueryProvider>
      <PortalContents kind={kind} />
    </CitizenQueryProvider>
  ) : (
    <PortalContents kind={kind} />
  );
}
