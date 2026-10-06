import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { busesApi } from "../services/api";
import { getPlaceCoordinates, toTrackingBus } from "../services/busRoutes";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Students.css";

// Create a custom HTML/DivIcon featuring a bus emoji
const busEmojiIcon = L.divIcon({
  className: "custom-bus-marker",
  html: `<div style="
    background: #ffffff; 
    border: 2px solid #2563eb; 
    border-radius: 50%; 
    width: 38px; 
    height: 38px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 20px; 
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  ">🚌</div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -20],
});

// Create a custom destination icon for FISAT college
const collegeEmojiIcon = L.divIcon({
  className: "custom-college-marker",
  html: `<div style="
    background: #059669; 
    border: 2px solid #ffffff; 
    border-radius: 50%; 
    width: 38px; 
    height: 38px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 20px; 
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  ">🏫</div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -20],
});

function RouteBounds({ coordinates }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length) {
      map.fitBounds(L.latLngBounds(coordinates), { padding: [40, 40] });
    }
  }, [coordinates, map]);

  return null;
}

const LiveTracking = () => {
  const navigate = useNavigate();

  const collegeLocation = {
    name: "Federal Institute of Science and Technology (FISAT), Hormis Nagar, Mookannoor, Angamaly",
    coordinates: getPlaceCoordinates("Campus"),
  };

  const [liveBuses, setLiveBuses] = useState([]);
  const [busLoadError, setBusLoadError] = useState("");
  const [selectedBusId, setSelectedBusId] = useState("");
  const [selectedBus, setSelectedBus] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeBusId, setRouteBusId] = useState("");
  const [routeDistanceKm, setRouteDistanceKm] = useState(0);
  const [routeDurationMinutes, setRouteDurationMinutes] = useState(0);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let isCurrentRequest = true;
    busesApi.getAll()
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Unexpected bus list response.");
        }
        if (isCurrentRequest) {
          setLiveBuses(data.map(toTrackingBus));
          setBusLoadError("");
        }
      })
      .catch((error) => {
        console.error("Could not load tracking buses from api_bus:", error);
        if (isCurrentRequest) {
          setBusLoadError("Could not load registered buses from the database.");
        }
      });
    return () => {
      isCurrentRequest = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedBus) return undefined;

    if (selectedBus.routePath.some((coordinate) => !coordinate)) return undefined;

    let isCurrentRoute = true;
    const coordinates = selectedBus.routePath
      .map(([latitude, longitude]) => `${longitude},${latitude}`)
      .join(";");

    const fetchRoadRoute = async () => {
      setRouteLoading(true);
      setRouteError("");
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`
        );
        if (!response.ok) {
          throw new Error(`Route request failed with status ${response.status}.`);
        }
        const data = await response.json();
        const route = data.routes?.[0];
        if (!route?.geometry?.coordinates?.length) {
          throw new Error("No road route was returned for this bus.");
        }
        if (isCurrentRoute) {
          setRouteCoordinates(
            route.geometry.coordinates.map(([longitude, latitude]) => [latitude, longitude])
          );
          setRouteBusId(selectedBus.busId);
          setRouteDistanceKm(route.distance / 1000);
          setRouteDurationMinutes(Math.ceil(route.duration / 60));
          setRouteError("");
        }
      } catch (error) {
        console.error(`Could not load road route for ${selectedBus.busId}:`, error);
        if (isCurrentRoute) {
          setRouteCoordinates([]);
          setRouteBusId("");
          setRouteError("Road routing is unavailable; the road route could not be displayed.");
        }
      } finally {
        if (isCurrentRoute) {
          setRouteLoading(false);
        }
      }
    };

    fetchRoadRoute();
    return () => {
      isCurrentRoute = false;
    };
  }, [selectedBus]);

  useEffect(() => {
    if (!selectedBus || routeBusId !== selectedBus.busId || !routeCoordinates.length) return undefined;

    const interval = setInterval(() => {
      setCurrentStep((prevStep) => {
        if (prevStep < routeCoordinates.length - 1) {
          return prevStep + 1;
        } else {
          return prevStep;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedBus, routeCoordinates, routeBusId]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!selectedBusId) {
      setErrorMsg("Please select a bus to track.");
      setSelectedBus(null);
      return;
    }

    const foundBus = liveBuses.find((bus) => bus.busId === selectedBusId);

    if (foundBus) {
      setSelectedBus({ ...foundBus });
      setCurrentStep(0);
      setRouteCoordinates([]);
      setRouteBusId("");
      setRouteError("");
      setErrorMsg("");
    } else if (!foundBus) {
      setSelectedBus(null);
      setErrorMsg("The selected bus could not be found.");
    }
  };

  const hasCurrentRoute = Boolean(selectedBus && routeBusId === selectedBus.busId && routeCoordinates.length);
  const hasUnmappedEndpoint = Boolean(selectedBus?.routePath.some((coordinate) => !coordinate));
  const displayedRouteError = hasUnmappedEndpoint
    ? `A map location is not configured for ${selectedBus.startingPlace} or ${selectedBus.endingPlace}.`
    : routeError;
  const isRouteLoading = Boolean(selectedBus && !hasCurrentRoute && !displayedRouteError) || (routeLoading && !hasUnmappedEndpoint);
  const activeCoordinates = routeCoordinates[currentStep] || selectedBus?.routePath[0] || collegeLocation.coordinates;
  const destinationName = selectedBus?.endingPlace || "destination";
  const campusCoordinates = selectedBus?.startingPlace?.toLowerCase() === "campus"
    ? selectedBus.routePath[0]
    : selectedBus?.endingPlace?.toLowerCase() === "campus"
      ? selectedBus.routePath[1]
      : null;
  
  const totalSteps = Math.max(routeCoordinates.length - 1, 1);
  const remainingSteps = Math.max(totalSteps - currentStep, 0);
  const remainingRatio = remainingSteps / totalSteps;
  const exactRemainingDistance = (routeDistanceKm * remainingRatio).toFixed(1);
  
  const estimatedMinutesLeft = selectedBus && remainingSteps > 0
    ? Math.ceil(routeDurationMinutes * remainingRatio)
    : 0;
  
  const hasArrived = hasCurrentRoute && currentStep === totalSteps;

  return (
    <div className="students-page">
      <div className="students-header">
        <h2>Live Bus Tracking Portal</h2>
        <button className="back-btn" onClick={() => navigate("/admin")}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="students-layout" style={{ gridTemplateColumns: "1fr" }}>
        <div className="form-card" style={{ maxWidth: "100%" }}>
          <div className="form-card-header" style={{ marginBottom: "20px", borderBottom: "1px solid #e5e7eb", paddingBottom: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#1f2937" }}>Live Vehicle Tracking by Bus Route</h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.875rem", color: "#6b7280" }}>
              Bus routes and directions match the starting places and destinations configured on the Buses page.
            </p>
          </div>

          {(errorMsg || busLoadError) && <div className="error-banner">{errorMsg || busLoadError}</div>}

          <form onSubmit={handleSearch} style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "24px" }}>
            <select
              aria-label="Select a bus to track"
              className="students-search-box"
              style={{ flex: 1, padding: "10px 14px", borderRadius: "6px", border: "1px solid #d1d5db", background: "#fff" }}
              value={selectedBusId}
              onChange={(e) => {
                setSelectedBusId(e.target.value);
                setErrorMsg("");
              }}
            >
              <option value="">Select a bus to track</option>
              {liveBuses.map((bus) => (
                <option key={bus.busId} value={bus.busId}>
                  {bus.busId} — {bus.route} ({bus.driverName})
                </option>
              ))}
            </select>
            <button type="submit" className="submit-reg-btn" style={{ width: "150px", padding: "10px 16px", fontWeight: "600" }}>
              Enter
            </button>
          </form>

          {selectedBus ? (
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "20px", marginTop: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: "1.15rem", color: "#1f2937" }}>{selectedBus.busId} ({selectedBus.route})</h4>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "#4b5563" }}>Driver: <strong>{selectedBus.driverName}</strong></p>
                </div>
                <div>
                  <span style={{ padding: "4px 10px", borderRadius: "4px", background: hasArrived ? "#d1fae5" : "#e0e7ff", color: hasArrived ? "green" : "#1d4ed8", fontWeight: "bold", fontSize: "0.85rem" }}>
                    {hasArrived ? "Arrived" : selectedBus.status}
                  </span>
                </div>
              </div>

              {/* Real-world telemetry metrics matching distance and time */}
              {displayedRouteError && <div className="error-banner">{displayedRouteError}</div>}
              {isRouteLoading && <p role="status">Loading road route...</p>}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "20px" }}>
                <div style={{ background: "white", padding: "12px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
                  <span style={{ fontSize: "0.8rem", color: "#6b7280", display: "block" }}>Distance to {destinationName}</span>
                  <strong style={{ fontSize: "1rem", color: "#4f46e5" }}>
                    {isRouteLoading ? "Loading..." : displayedRouteError || !hasCurrentRoute ? "Unavailable" : `${exactRemainingDistance} km`}
                  </strong>
                </div>
                <div style={{ background: "white", padding: "12px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
                  <span style={{ fontSize: "0.8rem", color: "#6b7280", display: "block" }}>Estimated Time of Arrival</span>
                  <strong style={{ fontSize: "1rem", color: "#1f2937" }}>
                    {isRouteLoading ? "Loading..." : displayedRouteError || !hasCurrentRoute ? "Unavailable" : hasArrived ? `Arrived at ${destinationName}` : `~${estimatedMinutesLeft} mins`}
                  </strong>
                </div>
              </div>

              {/* Map Container */}
              <div style={{ width: "100%", height: "480px", borderRadius: "8px", overflow: "hidden", border: "1px solid #cbd5e1" }}>
                {hasCurrentRoute && (
                  <MapContainer
                    center={activeCoordinates}
                    zoom={13}
                    style={{ width: "100%", height: "100%" }}
                    key={selectedBus.busId}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Polyline
                      positions={routeCoordinates.slice(0, currentStep + 1)}
                      pathOptions={{ color: "#cbd5e1", weight: 5, opacity: 0.5 }}
                    />
                    <Polyline
                      positions={routeCoordinates.slice(currentStep)}
                      pathOptions={{ color: "#1a73e8", weight: 6, opacity: 0.85, lineCap: "round", lineJoin: "round" }}
                    />
                    <Marker position={activeCoordinates} icon={busEmojiIcon}>
                      <Popup>
                        <strong>🚌 {selectedBus.busId}</strong> <br />
                        Driver: {selectedBus.driverName} <br />
                        {hasArrived ? `Arrived at ${destinationName}` : `Distance to ${destinationName}: ${exactRemainingDistance} km`}
                      </Popup>
                    </Marker>
                    {campusCoordinates && (
                      <Marker position={campusCoordinates} icon={collegeEmojiIcon}>
                        <Popup>
                          <strong>🏫 {collegeLocation.name}</strong>
                          <br />
                          {selectedBus.startingPlace.toLowerCase() === "campus" ? "Route starts at campus" : "Route ends at campus"}
                        </Popup>
                      </Marker>
                    )}
                    <RouteBounds coordinates={routeCoordinates} />
                  </MapContainer>
                )}
                {!hasCurrentRoute && !isRouteLoading && (
                  <div role="status" style={{ height: "100%", display: "grid", placeItems: "center", color: "#6b7280", background: "#f9fafb" }}>
                    The road route is currently unavailable.
                  </div>
                )}
              </div>
              <p style={{ marginTop: "10px", fontSize: "0.8rem", color: "#6b7280", textAlign: "center" }}>
                🚌 {selectedBus.busId} travels from {selectedBus.startingPlace} to {selectedBus.endingPlace} along the road route.
              </p>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px", color: "#6b7280", background: "#f9fafb", borderRadius: "8px", border: "1px dashed #d1d5db" }}>
              <p style={{ margin: 0, fontSize: "0.95rem" }}>Select a bus above and click <strong>Enter</strong> to view its live road tracking for the configured region.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;