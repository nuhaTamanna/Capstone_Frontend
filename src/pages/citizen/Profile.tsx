import { useState } from "react";

export default function Profile() {
  const [name, setName] = useState("Citizen User");
  const [email, setEmail] = useState("citizen@example.com");
  const [city, setCity] = useState("Hyderabad");
  const [routePreference, setRoutePreference] = useState<"balanced" | "fastest" | "lowest-pollution" | "lowest-traffic">("balanced");
  const [trafficAlerts, setTrafficAlerts] = useState(true);
  const [pollutionAlerts, setPollutionAlerts] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(false);

  const savedPlaces = [
    { id: 1, name: "Home", icon: "🏠" },
    { id: 2, name: "Office", icon: "💼" },
    { id: 3, name: "College", icon: "🎓" },
  ];

  return (
    <>
      <header className="page-header">
        <p className="eyebrow">CITIZEN PORTAL</p>
        <h1>Profile</h1>
        <p>Manage your personal information, preferences, and notification settings.</p>
      </header>

      <section className="profile-section">
        <div className="profile-header">
          <div className="profile-avatar">C</div>
          <div className="profile-info">
            <h2>{name}</h2>
            <p>{email}</p>
          </div>
        </div>

        <form className="profile-form">
          <label>
            Full Name
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Preferred City
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
          </label>
        </form>
      </section>

      <section className="profile-section">
        <h3>Saved Places</h3>
        <div className="saved-places">
          {savedPlaces.map((place) => (
            <div key={place.id} className="saved-place">
              <span className="saved-place-icon">{place.icon}</span>
              <span className="saved-place-name">{place.name}</span>
              <div className="saved-place-actions">
                <button className="button text">Edit</button>
              </div>
            </div>
          ))}
          <button className="button secondary" style={{ width: "100%", marginTop: "8px" }}>
            + Add Place
          </button>
        </div>
      </section>

      <section className="profile-section">
        <h3>Route Preference</h3>
        <div className="profile-form">
          <label>
            <input
              type="radio"
              name="routePreference"
              checked={routePreference === "balanced"}
              onChange={() => setRoutePreference("balanced")}
            />
            Balanced
          </label>
          <label>
            <input
              type="radio"
              name="routePreference"
              checked={routePreference === "fastest"}
              onChange={() => setRoutePreference("fastest")}
            />
            Fastest
          </label>
          <label>
            <input
              type="radio"
              name="routePreference"
              checked={routePreference === "lowest-pollution"}
              onChange={() => setRoutePreference("lowest-pollution")}
            />
            Lowest pollution
          </label>
          <label>
            <input
              type="radio"
              name="routePreference"
              checked={routePreference === "lowest-traffic"}
              onChange={() => setRoutePreference("lowest-traffic")}
            />
            Lowest traffic
          </label>
        </div>
      </section>

      <section className="profile-section">
        <h3>Notification Preferences</h3>
        <div className="profile-form">
          <label>
            <input
              type="checkbox"
              checked={trafficAlerts}
              onChange={(e) => setTrafficAlerts(e.target.checked)}
            />
            Traffic alerts
          </label>
          <label>
            <input
              type="checkbox"
              checked={pollutionAlerts}
              onChange={(e) => setPollutionAlerts(e.target.checked)}
            />
            Pollution alerts
          </label>
          <label>
            <input
              type="checkbox"
              checked={weatherAlerts}
              onChange={(e) => setWeatherAlerts(e.target.checked)}
            />
            Weather alerts
          </label>
        </div>
      </section>

      <section className="profile-section">
        <button className="button primary">Save Changes</button>
      </section>
    </>
  );
}
