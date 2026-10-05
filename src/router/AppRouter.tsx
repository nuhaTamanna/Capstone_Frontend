import { BrowserRouter, Route, Routes } from "react-router-dom";
import PortalLayout from "../layouts/PortalLayout";
import Landing from "../pages/Landing";
import CitizenDashboard from "../pages/citizen/CitizenDashboard";
import SavedRoutes from "../pages/citizen/SavedRoutes";
import MyCommutes from "../pages/citizen/MyCommutes";
import Profile from "../pages/citizen/Profile";
import AlertsCitizen from "../pages/citizen/Alerts";
import AuthorityDashboard from "../pages/authority/AuthorityDashboard";
import AlertsAuthority from "../pages/authority/Alerts";
import AlertDetails from "../pages/authority/AlertDetails";
import Analytics from "../pages/authority/Analytics";
import Zones from "../pages/authority/Zones";
import Traffic from "../pages/shared/Traffic";
import AirQuality from "../pages/shared/AirQuality";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<PortalLayout kind="citizen" />}>
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route path="/citizen/traffic" element={<Traffic role="citizen" />} />
          <Route path="/citizen/air-quality" element={<AirQuality role="citizen" />} />
          <Route path="/citizen/my-commutes" element={<MyCommutes />} />
          <Route path="/citizen/saved-routes" element={<SavedRoutes />} />
          <Route path="/citizen/alerts" element={<AlertsCitizen role="citizen" />} />
          <Route path="/citizen/profile" element={<Profile />} />
        </Route>
        <Route element={<PortalLayout kind="authority" />}>
          <Route path="/authority" element={<AuthorityDashboard />} />
          <Route path="/authority/traffic" element={<Traffic role="authority" />} />
          <Route path="/authority/air-quality" element={<AirQuality role="authority" />} />
          <Route path="/authority/zones" element={<Zones />} />
          <Route path="/authority/alerts" element={<AlertsAuthority role="authority" />} />
          <Route path="/authority/alerts/:id" element={<AlertDetails />} />
          <Route path="/authority/analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
