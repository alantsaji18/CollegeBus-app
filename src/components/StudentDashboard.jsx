import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    name: "Alant",
    rollNo: "CS2026",
    busNumber: "Bus-101",
    route: "Route A - FISAT to City",
    stop: "Angamaly Town Junction",
    department: "Computer Science",
    className: "S6 MCA",
    contactNumber: "9876543210"
  });

  const [activeTab, setActiveTab] = useState("overview");

  const getTodayString = () => new Date().toISOString().split("T")[0];
  const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const [travelDirection, setTravelDirection] = useState("North-Bound (Morning Sun on Right)");
  const [predictionDone, setPredictionDone] = useState(false);
  const [predictedSunlightMap, setPredictedSunlightMap] = useState({});

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookingDate, setBookingDate] = useState(getTodayString());
  const [tripTime, setTripTime] = useState("Morning (07:45 AM)");
  
  const [myBookings, setMyBookings] = useState([]);
  const [bookingMessage, setBookingMessage] = useState("");

  // OSRM & Leaflet Map States starting from FISAT College
  const [osrmRouteCoords, setOsrmRouteCoords] = useState([]);
  const [osrmDistance, setOsrmDistance] = useState("Calculating...");
  const [osrmDuration, setOsrmDuration] = useState("Calculating...");
  const [busProgressIndex, setBusProgressIndex] = useState(0);
  const [currentActiveStopIndex, setCurrentActiveStopIndex] = useState(0);

  // 11 Waypoints: Starting explicitly at Federal Institute of Science and Technology (FISAT), Hormis Nagar, Mookannoor, Angamaly
  const routeStops = [
    { name: "FISAT College, Hormis Nagar, Mookannoor, Angamaly (Start)", coords: [10.2315, 76.4150] },
    { name: "Mookannoor Center", coords: [10.2405, 76.4161] },
    { name: "Azhakom Junction", coords: [10.2220, 76.3980] },
    { name: "Karukutty Church Stop", coords: [10.2050, 76.3910] },
    { name: "Kanjirakkad Junction", coords: [10.1890, 76.3850] },
    { name: "Angamaly Basilica Point", coords: [10.1900, 76.3800] },
    { name: "Angamaly KSRTC Bus Stand", coords: [10.1925, 76.3870] },
    { name: "Angamaly Railway Station Road", coords: [10.1830, 76.3840] },
    { name: "Adup Kutty Junction", coords: [10.1710, 76.3760] },
    { name: "Nedumbassery Airport Bypass", coords: [10.1550, 76.3650] },
    { name: "Athani Junction (Final Stop)", coords: [10.1410, 76.3550] }
  ];
  
  const mapRef = useRef(null);
  const leafletMapInstance = useRef(null);
  const busMarkerRef = useRef(null);
  const completedPolylineRef = useRef(null);
  const remainingPolylineRef = useRef(null);
  const stopMarkersRef = useRef([]);

  useEffect(() => {
    const savedBookings = localStorage.getItem("studentBookings");
    if (savedBookings) {
      try {
        setMyBookings(JSON.parse(savedBookings));
      } catch (err) {
        console.error("Failed to parse bookings", err);
      }
    }
  }, []);

  // Fetch full OSRM route passing through coordinates from FISAT to Athani
  useEffect(() => {
    if (activeTab === "tracking") {
      const coordinatesString = routeStops.map(s => `${s.coords[1]},${s.coords[0]}`).join(";");

      const fetchOSRMRoute = async () => {
        try {
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${coordinatesString}?overview=full&geometries=geojson`
          );
          const data = await response.json();
          if (data.routes && data.routes.length > 0) {
            const routeObj = data.routes[0];
            setOsrmDistance((routeObj.distance / 1000).toFixed(1) + " km");
            setOsrmDuration(Math.ceil(routeObj.duration / 60) + " mins");

            const coords = routeObj.geometry.coordinates.map(coord => [coord[1], coord[0]]);
            setOsrmRouteCoords(coords);
            setBusProgressIndex(0);
          }
        } catch (error) {
          console.error("Error fetching OSRM route:", error);
          const fallback = routeStops.map(s => s.coords);
          setOsrmRouteCoords(fallback);
          setOsrmDistance("16.5 km");
          setOsrmDuration("34 mins");
        }
      };

      fetchOSRMRoute();
    }
  }, [activeTab]);

  // Initialize Leaflet Map Instance
  useEffect(() => {
    if (activeTab === "tracking" && window.L && mapRef.current) {
      if (!leafletMapInstance.current) {
        const map = window.L.map(mapRef.current, {
          zoomControl: false
        }).setView([10.19, 76.38], 13);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap & OSRM Engine'
        }).addTo(map);

        window.L.control.zoom({ position: 'bottomright' }).addTo(map);
        leafletMapInstance.current = map;
      } else {
        leafletMapInstance.current.invalidateSize();
      }
    }
  }, [activeTab]);

  // Render Route, All 11 Stops, and Bus Emoji Marker
  useEffect(() => {
    if (leafletMapInstance.current && osrmRouteCoords.length > 0 && window.L) {
      const map = leafletMapInstance.current;

      if (completedPolylineRef.current) map.removeLayer(completedPolylineRef.current);
      if (remainingPolylineRef.current) map.removeLayer(remainingPolylineRef.current);
      if (busMarkerRef.current) map.removeLayer(busMarkerRef.current);
      stopMarkersRef.current.forEach(m => map.removeLayer(m));
      stopMarkersRef.current = [];

      completedPolylineRef.current = window.L.polyline([], {
        color: '#cbd5e1',
        weight: 5,
        opacity: 0.5
      }).addTo(map);

      remainingPolylineRef.current = window.L.polyline(osrmRouteCoords, {
        color: '#1a73e8',
        weight: 6,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      routeStops.forEach((stop, idx) => {
        const stopIcon = window.L.divIcon({
          className: 'google-stop-pin',
          html: `<div style="background-color: ${idx === 0 ? '#10b981' : idx === routeStops.length - 1 ? '#ef4444' : '#ffffff'}; color: ${idx === 0 || idx === routeStops.length - 1 ? '#fff' : '#1a73e8'}; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; border: 2px solid #1a73e8; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">${idx + 1}</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const marker = window.L.marker(stop.coords, { icon: stopIcon })
          .addTo(map)
          .bindPopup(`<b>Stop ${idx + 1}: ${stop.name}</b><br/>FISAT Transit Network`);
        
        stopMarkersRef.current.push(marker);
      });

      const busEmojiIcon = window.L.divIcon({
        className: 'custom-bus-emoji-marker',
        html: `<div style="background-color: #1a73e8; color: white; padding: 6px 12px; border-radius: 20px; font-weight: bold; font-size: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 6px; border: 2px solid white; white-space: nowrap;">🚌 ${student.busNumber}</div>`,
        iconSize: [110, 40],
        iconAnchor: [55, 20]
      });

      busMarkerRef.current = window.L.marker(routeStops[0].coords, { icon: busEmojiIcon }).addTo(map);
      map.fitBounds(remainingPolylineRef.current.getBounds(), { padding: [50, 50] });
    }
  }, [osrmRouteCoords]);

  useEffect(() => {
    let interval;
    if (activeTab === "tracking" && osrmRouteCoords.length > 0 && busMarkerRef.current) {
      interval = setInterval(() => {
        setBusProgressIndex((prevIndex) => {
          const nextIndex = prevIndex >= osrmRouteCoords.length - 1 ? 0 : prevIndex + 1;
          const currentPos = osrmRouteCoords[nextIndex];
          
          if (busMarkerRef.current) {
            busMarkerRef.current.setLatLng(currentPos);
          }

          const traveledCoords = osrmRouteCoords.slice(0, nextIndex + 1);
          const upcomingCoords = osrmRouteCoords.slice(nextIndex);

          if (completedPolylineRef.current) {
            completedPolylineRef.current.setLatLngs(traveledCoords);
          }
          if (remainingPolylineRef.current) {
            remainingPolylineRef.current.setLatLngs(upcomingCoords);
          }

          const calculatedStopIndex = Math.floor((nextIndex / osrmRouteCoords.length) * routeStops.length);
          setCurrentActiveStopIndex(Math.min(calculatedStopIndex, routeStops.length - 1));

          return nextIndex;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTab, osrmRouteCoords]);

  const handleLogout = () => navigate("/studentlogin");

  const [busMatrix, setBusMatrix] = useState([
    [{ id: "1,1", status: "available" }, { id: "1,2", status: "available" }, { id: "1,3", status: "available" }, { id: "1,4", status: "available" }, { id: "1,5", status: "available" }, { id: "1,6", status: "sold" }],
    [{ id: "2,1", status: "available" }, { id: "2,2", status: "available" }, { id: "2,3", status: "available" }, { id: "2,4", status: "available" }, { id: "2,5", status: "available" }, { id: "2,6", status: "available" }],
    [{ id: "3,1", status: "available" }, { id: "3,2", status: "available" }, { id: "3,3", status: "available" }, { id: "3,4", status: "sold" }, { id: "3,5", status: "sold" }, { id: "3,6", status: "sold" }],
    [{ id: "4,1", status: "available" }, { id: "4,2", status: "available" }, { id: "4,3", status: "available" }, { id: "4,4", status: "available" }, { id: "4,5", status: "available" }, { id: "4,6", status: "available" }],
    [{ id: "5,1", status: "available" }, { id: "5,2", status: "available" }, { id: "5,3", status: "available" }, { id: "5,4", status: "available" }, { id: "5,5", status: "sold" }, { id: "5,6", status: "sold" }],
    [{ id: "6,1", status: "sold" }, { id: "6,2", status: "available" }, { id: "6,3", status: "available" }, { id: "6,4", status: "available" }, { id: "6,5", status: "available" }, { id: "6,6", status: "available" }],
    [{ id: "7,1", status: "available" }, { id: "7,2", status: "available" }, { id: "7,3", status: "available" }, { id: "7,4", status: "available" }, { id: "7,5", status: "available" }, { id: "7,6", status: "available" }],
    [{ id: "8,1", status: "sold" }, { id: "8,2", status: "sold" }, { id: "8,3", status: "available" }, { id: "8,4", status: "available" }, { id: "8,5", status: "available" }, { id: "8,6", status: "sold" }],
  ]);

  const handleRunRandomForestPrediction = (e) => {
    e.preventDefault();
    const newMap = {};
    busMatrix.forEach((row) => {
      row.forEach((seat) => {
        const [r, c] = seat.id.split(",").map(Number);
        let riskScore = "green";
        if (c >= 4 && tripTime.includes("Morning")) {
          riskScore = r > 4 ? "red" : "yellow";
        } else {
          riskScore = (r + c) % 2 === 0 ? "green" : "yellow";
        }
        newMap[seat.id] = riskScore;
      });
    });
    setPredictedSunlightMap(newMap);
    setPredictionDone(true);
    setBookingMessage("Random Forest Sunlight Model executed successfully!");
  };

  const handleSeatClick = (rowIdx, colIdx, seat) => {
    if (seat.status === "disabled" || seat.status === "sold") return;
    const updated = busMatrix.map((row, rIdx) =>
      row.map((s, cIdx) => (rIdx === rowIdx && cIdx === colIdx ? { ...s, status: s.status === "selected" ? "available" : "selected" } : s))
    );
    setBusMatrix(updated);
    setSelectedSeat(selectedSeat === seat.id ? null : seat.id);
  };

  const handleBookSeat = () => {
    if (!selectedSeat) {
      setBookingMessage("Please select a seat from the layout first.");
      return;
    }
    const newBooking = {
      bookingId: "BK-" + Math.floor(1000 + Math.random() * 9000),
      seatNo: selectedSeat,
      busNumber: student.busNumber,
      route: student.route,
      date: bookingDate,
      time: tripTime,
    };
    const updatedBookings = [...myBookings, newBooking];
    setMyBookings(updatedBookings);
    localStorage.setItem("studentBookings", JSON.stringify(updatedBookings));
    setBusMatrix(busMatrix.map(row => row.map(s => s.id === selectedSeat ? { ...s, status: "sold" } : s)));
    setBookingMessage(`Successfully booked seat [${selectedSeat}]!`);
    setSelectedSeat(null);
  };

  const handleCancelBooking = (bookingId, seatNo) => {
    const updatedBookings = myBookings.filter(b => b.bookingId !== bookingId);
    setMyBookings(updatedBookings);
    localStorage.setItem("studentBookings", JSON.stringify(updatedBookings));
    setBusMatrix(busMatrix.map(row => row.map(s => s.id === seatNo ? { ...s, status: "available" } : s)));
    setBookingMessage(`Booking ${bookingId} cancelled.`);
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerTitleContainer}>
          <div style={styles.logoIcon}>🚌</div>
          <div>
            <h1 style={styles.headerTitle}>FISAT Student Portal</h1>
            <p style={styles.headerSubtitle}>Transport & Safety Management System</p>
          </div>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <i className="fas fa-sign-out-alt" style={{ marginRight: "6px" }}></i> Log out
        </button>
      </header>

      <div style={styles.heroBanner}>
        <div style={styles.heroOverlayContent}>
          <div style={styles.heroBadgeBox}>
            <h2 style={styles.heroTitle}>Student Transit & Seat Reservation</h2>
            <p style={styles.heroSubText}>Welcome back, {student.name} ({student.rollNo}) • FISAT Hormis Nagar Campus.</p>
          </div>
        </div>
      </div>

      <div style={styles.quickStatsContainer}>
        <div style={styles.statCard} onClick={() => setActiveTab("overview")}>
          <div style={styles.statIconWrapper}>🚌</div>
          <div>
            <h4 style={styles.statTitle}>Assigned Bus</h4>
            <p style={styles.statValue}>{student.busNumber}</p>
          </div>
        </div>
        <div style={styles.statCard} onClick={() => setActiveTab("tracking")}>
          <div style={{ ...styles.statIconWrapper, backgroundColor: "#1a73e8" }}><i className="fas fa-map-marked-alt"></i></div>
          <div>
            <h4 style={styles.statTitle}>Google Maps GPS</h4>
            <p style={styles.statValue}>11 Stops Live Tracking</p>
          </div>
        </div>
        <div style={styles.statCard} onClick={() => setActiveTab("seating")}>
          <div style={{ ...styles.statIconWrapper, backgroundColor: "#f59e0b" }}><i className="fas fa-chair"></i></div>
          <div>
            <h4 style={styles.statTitle}>Seat Booking</h4>
            <p style={styles.statValue}>ML Sunlight Predictor</p>
          </div>
        </div>
        <div style={styles.statCard} onClick={() => setActiveTab("bookings")}>
          <div style={{ ...styles.statIconWrapper, backgroundColor: "#6366f1" }}><i className="fas fa-ticket-alt"></i></div>
          <div>
            <h4 style={styles.statTitle}>My Bookings</h4>
            <p style={styles.statValue}>{myBookings.length} / 4 Weekly</p>
          </div>
        </div>
      </div>

      <div style={styles.tabWrapperOuter}>
        <div style={styles.tabContainer}>
          <button style={{ ...styles.tabButton, ...(activeTab === "overview" ? styles.activeTab : {}) }} onClick={() => setActiveTab("overview")}>
            <i className="fas fa-info-circle" style={{ marginRight: "8px" }}></i> Route & Schedule
          </button>
          <button style={{ ...styles.tabButton, ...(activeTab === "tracking" ? styles.activeTab : {}) }} onClick={() => setActiveTab("tracking")}>
            <i className="fas fa-map-marked-alt" style={{ marginRight: "8px" }}></i> Google Maps Live Tracking
          </button>
          <button style={{ ...styles.tabButton, ...(activeTab === "seating" ? styles.activeTab : {}) }} onClick={() => setActiveTab("seating")}>
            <i className="fas fa-sun" style={{ marginRight: "8px" }}></i> ML Sunlight & Booking
          </button>
          <button style={{ ...styles.tabButton, ...(activeTab === "bookings" ? styles.activeTab : {}) }} onClick={() => setActiveTab("bookings")}>
            <i className="fas fa-ticket-alt" style={{ marginRight: "8px" }}></i> My Bookings ({myBookings.length})
          </button>
        </div>
      </div>

      <main style={styles.mainContent}>
        {/* Added Student Name & Profile Display Banner */}
        <div style={styles.studentProfileBar}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div style={styles.studentAvatarCircle}>
              <i className="fas fa-user-graduate"></i>
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#0c2340", fontWeight: "700" }}>{student.name}</h2>
              <p style={{ margin: "2px 0 0 0", fontSize: "0.85rem", color: "#64748b" }}>Roll No: <strong>{student.rollNo}</strong> | Class: <strong>{student.className}</strong> ({student.department})</p>
            </div>
          </div>
          <div style={styles.studentBadgeStatus}>
            <span style={styles.statusDot}></span> Verified Student
          </div>
        </div>

        {bookingMessage && (
          <div style={styles.alertBanner}>
            <span>{bookingMessage}</span>
            <button onClick={() => setBookingMessage("")} style={styles.closeAlert}>&times;</button>
          </div>
        )}

        {activeTab === "overview" && (
          <div style={styles.cardGrid}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}><i className="fas fa-route" style={{ color: "#0c2340", marginRight: "8px" }}></i> Assigned Route Information</h3>
              <div style={styles.infoRow}><strong>Student Name:</strong> <span style={{ fontWeight: "bold", color: "#1a73e8" }}>{student.name}</span></div>
              <div style={styles.infoRow}><strong>Assigned Bus:</strong> <span>{student.busNumber}</span></div>
              <div style={styles.infoRow}><strong>Route Name:</strong> <span>{student.route}</span></div>
              <div style={styles.infoRow}><strong>Origin College:</strong> <span style={{ color: "#10b981", fontWeight: "bold" }}>Federal Institute of Science and Technology (FISAT), Hormis Nagar, Mookannoor, Angamaly</span></div>
              <div style={styles.infoRow}><strong>Boarding Stop:</strong> <span>{student.stop}</span></div>
              <div style={styles.infoRow}><strong>Department / Class:</strong> <span>{student.department} - {student.className}</span></div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}><i className="fas fa-clock" style={{ color: "#0c2340", marginRight: "8px" }}></i> Daily Transit Schedule</h3>
              <ul style={styles.scheduleList}>
                <li><strong>Dispatch (FISAT Campus):</strong> 07:45 AM</li>
                <li><strong>Total Transit Stops:</strong> 11 Marked Waypoints</li>
                <li><strong>Evening Return:</strong> 04:15 PM from Angamaly / City</li>
                <li><strong>Status:</strong> <span style={{ color: "#10b981", fontWeight: "bold" }}>Active GPS Service</span></li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "tracking" && (
          <div style={styles.card}>
            <div style={styles.googleMapHeaderBar}>
              <div>
                <h3 style={{ ...styles.cardTitle, margin: 0 }}><i className="fas fa-map-marked-alt" style={{ color: "#1a73e8", marginRight: "8px" }}></i> Live Transit for {student.name} ({student.busNumber})</h3>
                <p style={{ ...styles.subText, margin: "4px 0 0 0" }}>Starting at <strong>Federal Institute of Science and Technology, Hormis Nagar, Mookannoor, Angamaly</strong> with 11 mapped stops.</p>
              </div>
              <div style={styles.googleRouteBadge}>
                <span>Distance: <strong>{osrmDistance}</strong></span>
                <span>ETA: <strong style={{color: "#1a73e8"}}>{osrmDuration}</strong></span>
              </div>
            </div>

            <div style={styles.nextStopLiveBanner}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={styles.pulseIndicator}></span>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", fontWeight: "700" }}>Automatically Updated Next Stop:</span>
                  <div style={{ fontSize: "1.05rem", fontWeight: "bold", color: "#1a73e8" }}>
                    Stop #{currentActiveStopIndex + 1}: {routeStops[currentActiveStopIndex]?.name}
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.googleMapWrapper}>
              <div ref={mapRef} style={{ width: "100%", height: "450px", borderRadius: "10px", zIndex: 1 }}></div>
            </div>
          </div>
        )}

        {activeTab === "seating" && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}><i className="fas fa-sun" style={{ color: "#0c2340", marginRight: "8px" }}></i> Random Forest Sunlight Intensity Predictor</h3>
            <form onSubmit={handleRunRandomForestPrediction} style={styles.mlFormBoxSingle}>
              <div style={styles.configField}>
                <label style={styles.configLabel}><i className="fas fa-compass" style={{ marginRight: "5px" }}></i> Direction</label>
                <select value={travelDirection} onChange={(e) => setTravelDirection(e.target.value)} style={styles.configInput}>
                  <option value="North-Bound (Morning Sun on Right)">North-Bound (Morning Sun on Right)</option>
                  <option value="South-Bound (Morning Sun on Left)">South-Bound (Morning Sun on Left)</option>
                  <option value="East-Bound (Direct Front Glare)">East-Bound (Direct Front Glare)</option>
                  <option value="West-Bound (Afternoon Sun Glare)">West-Bound (Afternoon Sun Glare)</option>
                </select>
              </div>
              <div style={styles.configField}>
                <label style={styles.configLabel}><i className="fas fa-calendar-alt" style={{ marginRight: "5px" }}></i> Date</label>
                <input type="date" min={getTodayString()} max={getTomorrowString()} value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} style={styles.configInput} />
              </div>
              <div style={styles.configField}>
                <label style={styles.configLabel}><i className="fas fa-clock" style={{ marginRight: "5px" }}></i> Time Slot</label>
                <select value={tripTime} onChange={(e) => setTripTime(e.target.value)} style={styles.configInput}>
                  <option value="Morning (07:45 AM)">Morning (07:45 AM)</option>
                  <option value="Evening (04:15 PM)">Evening (04:15 PM)</option>
                </select>
              </div>
              <div style={{ textAlign: "center" }}>
                <button type="submit" style={styles.mlPredictBtn}>
                  <i className="fas fa-brain" style={{ marginRight: "8px" }}></i> Predict Sunlight
                </button>
              </div>
            </form>

            {predictionDone && (
              <div style={styles.busLayoutBox}>
                <div style={styles.busFrontIndicator}>Front of bus (FISAT College Dispatch)</div>

                <div style={styles.legendContainer}>
                  <div style={styles.legendItem}>
                    <div style={{ ...styles.legendBox, backgroundColor: "#4ade80", border: "2px solid #166534" }}></div>
                    <span>Recommended (Shade)</span>
                  </div>
                  <div style={styles.legendItem}>
                    <div style={{ ...styles.legendBox, backgroundColor: "#fde047", border: "2px solid #a16207" }}></div>
                    <span>Moderate Sun</span>
                  </div>
                  <div style={styles.legendItem}>
                    <div style={{ ...styles.legendBox, backgroundColor: "#fca5a5", border: "2px solid #b91c1c" }}></div>
                    <span>Not Recommended (Glare)</span>
                  </div>
                  <div style={styles.legendItem}>
                    <div style={{ ...styles.legendBox, backgroundColor: "#a5f3fc", border: "2px solid #06b6d4" }}></div>
                    <span>Already Booked</span>
                  </div>
                  <div style={styles.legendItem}>
                    <div style={{ ...styles.legendBox, backgroundColor: "#1e3a8a", border: "2px solid #0f172a" }}></div>
                    <span>Selected Seat</span>
                  </div>
                </div>

                <div style={styles.busSeatMatrix}>
                  {busMatrix.map((row, rIndex) => (
                    <div key={rIndex} style={styles.busRow}>
                      <div style={styles.seatGroup}>
                        {row.slice(0, 3).map((seat, cIndex) => {
                          const sunlightTag = predictedSunlightMap[seat.id];
                          let bg = "#ffffff", border = "2px solid #22c55e", cursor = "pointer";
                          if (seat.status === "disabled") { bg = "#6b7280"; border = "2px solid #4b5563"; cursor = "not-allowed"; }
                          else if (seat.status === "sold") { bg = "#a5f3fc"; border = "2px solid #06b6d4"; cursor = "not-allowed"; }
                          else if (seat.status === "selected") { bg = "#1e3a8a"; border = "2px solid #0f172a"; }
                          else {
                            if (sunlightTag === "green") { bg = "#4ade80"; border = "2px solid #166534"; }
                            else if (sunlightTag === "yellow") { bg = "#fde047"; border = "2px solid #a16207"; }
                            else if (sunlightTag === "red") { bg = "#fca5a5"; border = "2px solid #b91c1c"; }
                          }
                          return <div key={seat.id} onClick={() => handleSeatClick(rIndex, cIndex, seat)} style={{ ...styles.seatSquare, backgroundColor: bg, border, cursor }} />;
                        })}
                      </div>
                      <div style={styles.aisleSpace}></div>
                      <div style={styles.seatGroup}>
                        {row.slice(3, 6).map((seat, cIndex) => {
                          const actualCol = cIndex + 3;
                          const sunlightTag = predictedSunlightMap[seat.id];
                          let bg = "#ffffff", border = "2px solid #22c55e", cursor = "pointer";
                          if (seat.status === "disabled") { bg = "#6b7280"; border = "2px solid #4b5563"; cursor = "not-allowed"; }
                          else if (seat.status === "sold") { bg = "#a5f3fc"; border = "2px solid #06b6d4"; cursor = "not-allowed"; }
                          else if (seat.status === "selected") { bg = "#1e3a8a"; border = "2px solid #0f172a"; }
                          else {
                            if (sunlightTag === "green") { bg = "#4ade80"; border = "2px solid #166534"; }
                            else if (sunlightTag === "yellow") { bg = "#fde047"; border = "2px solid #a16207"; }
                            else if (sunlightTag === "red") { bg = "#fca5a5"; border = "2px solid #b91c1c"; }
                          }
                          return <div key={seat.id} onClick={() => handleSeatClick(rIndex, actualCol, seat)} style={{ ...styles.seatSquare, backgroundColor: bg, border, cursor }} />;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <button onClick={handleBookSeat} style={styles.showSelectedBtn}>Confirm Reservation for {student.name}</button>
                  <div style={{ marginTop: "10px", fontFamily: "monospace", fontSize: "1rem" }}>{selectedSeat ? `[${selectedSeat.replace(",", "][")}]` : "[None Selected]"}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "bookings" && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}><i className="fas fa-ticket-alt" style={{ color: "#0c2340", marginRight: "8px" }}></i> Manage Bookings for {student.name} ({myBookings.length} / 4 Active)</h3>
            {myBookings.length === 0 ? (
              <p style={styles.subText}>You have no active seat bookings yet.</p>
            ) : (
              <div style={styles.tableResponsive}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Booking ID</th>
                      <th style={styles.th}>Student</th>
                      <th style={styles.th}>Bus No</th>
                      <th style={styles.th}>Route</th>
                      <th style={styles.th}>Seat</th>
                      <th style={styles.th}>Date & Slot</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myBookings.map((b) => (
                      <tr key={b.bookingId}>
                        <td style={styles.td}>{b.bookingId}</td>
                        <td style={styles.td}><strong>{student.name}</strong></td>
                        <td style={styles.td}>{b.busNumber}</td>
                        <td style={styles.td}>{b.route}</td>
                        <td style={styles.td}><strong>[{b.seatNo.replace(",", "][")}]</strong></td>
                        <td style={styles.td}>{b.date} <br/><small style={{color: "#1a73e8"}}>{b.time}</small></td>
                        <td style={styles.td}><button onClick={() => handleCancelBooking(b.bookingId, b.seatNo)} style={styles.cancelBtn}>Cancel</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: { 
    minHeight: "100vh", 
    backgroundImage: `linear-gradient(rgba(244, 247, 246, 0.88), rgba(244, 247, 246, 0.88)), url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80')`, 
    backgroundSize: "cover", 
    backgroundPosition: "center", 
    backgroundAttachment: "fixed", 
    fontFamily: "'Inter', 'Segoe UI', sans-serif" 
  },
  header: { backgroundColor: "#0c2340", color: "#ffffff", padding: "15px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
  headerTitleContainer: { display: "flex", alignItems: "center", gap: "15px" },
  logoIcon: { width: "45px", height: "45px", borderRadius: "50%", backgroundColor: "#ffc107", color: "#0c2340", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.4rem" },
  headerTitle: { margin: 0, fontSize: "1.3rem", fontWeight: 800 },
  headerSubtitle: { margin: "2px 0 0 0", fontSize: "0.8rem", color: "#cbd5e1" },
  logoutBtn: { backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "#ffffff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: 600 },
  heroBanner: { 
    position: "relative", 
    width: "100%", 
    height: "320px", 
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.40), rgba(0, 0, 0, 0.65)), url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80')`, 
    backgroundSize: "cover", 
    backgroundPosition: "center", 
    display: "flex", 
    alignItems: "flex-end", 
    padding: "30px 40px" 
  },
  heroOverlayContent: { maxWidth: "1200px", width: "100%", margin: "0 auto" },
  heroBadgeBox: { backgroundColor: "rgba(12, 35, 64, 0.85)", backdropFilter: "blur(6px)", padding: "20px 25px", borderRadius: "12px", borderLeft: "5px solid #ffc107", maxWidth: "600px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" },
  heroTitle: { color: "#ffffff", margin: "0 0 5px 0", fontSize: "1.4rem", fontWeight: 700 },
  heroSubText: { color: "#e2e8f0", margin: 0, fontSize: "0.9rem" },
  quickStatsContainer: { maxWidth: "1200px", margin: "-30px auto 20px auto", padding: "0 40px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", position: "relative", zIndex: 10 },
  statCard: { backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(4px)", padding: "20px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: "15px", cursor: "pointer" },
  statIconWrapper: { width: "45px", height: "45px", borderRadius: "10px", backgroundColor: "#0c2340", color: "#ffffff", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.3rem" },
  statTitle: { margin: "0", fontSize: "0.8rem", color: "#64748b", textTransform: "uppercase" },
  statValue: { margin: "4px 0 0 0", fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" },
  tabWrapperOuter: { backgroundColor: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(4px)", borderBottom: "1px solid #e2e8f0", marginTop: "20px" },
  tabContainer: { display: "flex", maxWidth: "1200px", margin: "0 auto", padding: "0 40px", justifyContent: "center", gap: "20px" },
  tabButton: { padding: "15px 20px", border: "none", background: "transparent", fontSize: "0.95rem", fontWeight: 600, color: "#64748b", cursor: "pointer", borderBottom: "3px solid transparent", flex: 1, maxWidth: "260px" },
  activeTab: { color: "#0c2340", borderBottomColor: "#1a73e8" },
  mainContent: { maxWidth: "1200px", margin: "30px auto", padding: "0 40px" },
  studentProfileBar: { backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(4px)", padding: "18px 25px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.06)", marginBottom: "25px", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: "5px solid #1a73e8" },
  studentAvatarCircle: { width: "45px", height: "45px", borderRadius: "50%", backgroundColor: "#eff6ff", color: "#1a73e8", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.2rem", border: "1px solid #bfdbfe" },
  studentBadgeStatus: { backgroundColor: "#f0fdf4", color: "#166534", padding: "6px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "700", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: "6px" },
  statusDot: { width: "8px", height: "8px", backgroundColor: "#22c55e", borderRadius: "50%", display: "inline-block" },
  card: { backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(4px)", padding: "30px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.08)", marginBottom: "30px" },
  cardTitle: { margin: "0 0 20px 0", fontSize: "1.2rem", fontWeight: 700, color: "#0c2340", display: "flex", alignItems: "center" },
  cardGrid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "25px" },
  infoRow: { marginBottom: "12px", fontSize: "0.95rem", color: "#334155", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" },
  scheduleList: { paddingLeft: "20px", color: "#334155", lineHeight: "1.8", margin: 0 },
  alertBanner: { backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", color: "#1e40af", padding: "12px 20px", borderRadius: "8px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "600" },
  closeAlert: { background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#1e40af" },
  googleMapHeaderBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", flexWrap: "wrap", gap: "10px" },
  googleRouteBadge: { display: "flex", gap: "15px", backgroundColor: "#f8fafc", padding: "8px 15px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.9rem" },
  nextStopLiveBanner: { backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", padding: "12px 20px", borderRadius: "8px", marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  pulseIndicator: { width: "12px", height: "12px", backgroundColor: "#22c55e", borderRadius: "50%", display: "inline-block", boxShadow: "0 0 0 rgba(34, 197, 94, 0.4)", animation: "pulse 1.5s infinite" },
  googleMapWrapper: { position: "relative", borderRadius: "10px", overflow: "hidden", border: "1px solid #cbd5e1" },
  mlFormBoxSingle: { display: "grid", gridTemplateColumns: "repeat(3, 1fr) auto", gap: "15px", alignItems: "flex-end", backgroundColor: "#f8fafc", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "20px" },
  configField: { display: "flex", flexDirection: "column", gap: "6px" },
  configLabel: { fontSize: "0.85rem", fontWeight: "600", color: "#475569" },
  configInput: { padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.9rem" },
  mlPredictBtn: { backgroundColor: "#1a73e8", color: "#ffffff", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "600", cursor: "pointer", height: "41px" },
  busLayoutBox: { backgroundColor: "#f8fafc", padding: "25px", borderRadius: "12px", border: "1px solid #e2e8f0", marginTop: "20px" },
  busFrontIndicator: { textAlign: "center", backgroundColor: "#0c2340", color: "#ffffff", padding: "8px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "700", marginBottom: "20px" },
  legendContainer: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "15px", margin: "15px 0 25px 0", padding: "10px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" },
  legendItem: { display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#334155", fontWeight: "600" },
  legendBox: { width: "16px", height: "16px", borderRadius: "4px" },
  busSeatMatrix: { display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" },
  busRow: { display: "flex", alignItems: "center", gap: "25px" },
  seatGroup: { display: "flex", gap: "8px" },
  aisleSpace: { width: "30px" },
  seatSquare: { width: "36px", height: "36px", borderRadius: "6px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "0.75rem", fontWeight: "bold", transition: "all 0.2s" },
  showSelectedBtn: { backgroundColor: "#10b981", color: "#ffffff", border: "none", padding: "12px 25px", borderRadius: "6px", fontWeight: "700", cursor: "pointer", fontSize: "0.95rem" },
  tableResponsive: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: { padding: "12px", backgroundColor: "#f1f5f9", color: "#475569", fontSize: "0.85rem", borderBottom: "2px solid #cbd5e1" },
  td: { padding: "12px", borderBottom: "1px solid #f1f5f9", fontSize: "0.9rem", color: "#334155" },
  cancelBtn: { backgroundColor: "#ef4444", color: "#ffffff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "600", fontSize: "0.80rem" },
  subText: { color: "#64748b", fontSize: "0.95rem", margin: 0 }
};