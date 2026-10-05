import { useState, useRef, useEffect } from "react";

interface SearchResult {
  id: string;
  type: "location" | "route" | "alert" | "zone";
  title: string;
  subtitle: string;
  icon: string;
  onClick: () => void;
}

interface GlobalSearchProps {
  onSearch?: (query: string) => void;
}

export default function GlobalSearch({ onSearch }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock search results - in production, this would call the backend
  const mockResults: SearchResult[] = [
    { id: "1", type: "location", title: "Gachibowli", subtitle: "Location", icon: "📍", onClick: () => {} },
    { id: "2", type: "location", title: "Madhapur", subtitle: "Location", icon: "📍", onClick: () => {} },
    { id: "3", type: "location", title: "Hitech City", subtitle: "Location", icon: "📍", onClick: () => {} },
    { id: "4", type: "route", title: "Home → Office", subtitle: "Saved Route", icon: "🚗", onClick: () => {} },
    { id: "5", type: "alert", title: "High Pollution Alert", subtitle: "Gachibowli", icon: "⚠️", onClick: () => {} },
    { id: "6", type: "zone", title: "Madhapur Zone", subtitle: "Traffic Hotspot", icon: "🔴", onClick: () => {} },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);

    if (value.length > 0) {
      const filtered = mockResults.filter(
        (result) =>
          result.title.toLowerCase().includes(value.toLowerCase()) ||
          result.subtitle.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    result.onClick();
    setQuery("");
    setIsOpen(false);
    onSearch?.(result.title);
  };

  return (
    <div className="global-search-container" ref={searchRef}>
      <div className="global-search-bar">
        <span>🔍</span>
        <input
          type="text"
          className="global-search-input"
          placeholder="Search locations, routes, zones..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
        />
      </div>
      {isOpen && results.length > 0 && (
        <div className="search-dropdown">
          {results.map((result) => (
            <div
              key={result.id}
              className="search-dropdown-item"
              onClick={() => handleResultClick(result)}
            >
              <span className="search-item-icon">{result.icon}</span>
              <div className="search-item-text">
                <div className="search-item-title">{result.title}</div>
                <div className="search-item-subtitle">{result.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
