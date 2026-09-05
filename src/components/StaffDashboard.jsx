import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function StaffDashboard() {
  const navigate = useNavigate();

  const [staff, setStaff] = useState({
    name: "Sreedeviamma P.",
    staffId: "SEC-GATE-04",
    designation: "Chief Gate Transit & Security Officer",
    department: "Main Security Gate Control",
    contact: "+91 9447987654"
  });

  const [activeTab, setActiveTab] = useState("overview");

  // Authorized Master Database Fleet Buses
  const fleetBuses = [
    { id: "Bus-101", routeName: "Campus → Angamaly", driver: "Ravi", coords: [10.2315, 76.4150], destCoords: [10.1410, 76.3550] },
    { id: "Bus-102", routeName: "Campus → Ernakulam", driver: "Arun", coords: [10.2315, 76.4150], destCoords: [9.9816, 76.2999] },
    { id: "Bus-103", routeName: "Campus → Chalakkudy", driver: "Meeran", coords: [10.2315, 76.4150], destCoords: [10.3116, 76.3312] },
    { id: "Bus-104", routeName: "Campus → Kothamangalam", driver: "Arjun", coords: [10.2315, 76.4150], destCoords: [10.0658, 76.6273] },
    { id: "Bus-105", routeName: "Campus → Muvattupuzha", driver: "Athul", coords: [10.2315, 76.4150], destCoords: [9.9839, 76.5796] },
  ];

  const [selectedTrackingBus, setSelectedTrackingBus] = useState("Bus-101");

  const initialTravelHistory = [
    { reportId: "REP-501", busNumber: "Bus-101", route: "Campus → Angamaly", driver: "Ravi", arrivalTime: "07:50 AM", departureTime: "03:45 PM", date: "2026-09-05", status: "On Time" },
    { reportId: "REP-502", busNumber: "Bus-102", route: "Campus → Ernakulam", driver: "Arun", arrivalTime: "08:05 AM", departureTime: "03:55 PM", date: "2026-09-05", status: "Delayed" },
    { reportId: "REP-503", busNumber: "Bus-103", route: "Campus → Chalakkudy", driver: "Meeran", arrivalTime: "07:55 AM", departureTime: "03:50 PM", date: "2026-09-05", status: "On Time" },
    { reportId: "REP-504", busNumber: "Bus-104", route: "Campus → Kothamangalam", driver: "Arjun", arrivalTime: "08:10 AM", departureTime: "03:40 PM", date: "2026-09-04", status: "Delayed" },
    { reportId: "REP-505", busNumber: "Bus-105", route: "Campus → Muvattupuzha", driver: "Athul", arrivalTime: "08:00 AM", departureTime: "03:50 PM", date: "2026-09-04", status: "On Time" },
  ];

  const [travelHistory, setTravelHistory] = useState(initialTravelHistory);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  // Record Entry & Edit Form States
  const [editingReportId, setEditingReportId] = useState(null); // Track if we are updating an existing record
  const [formBusNo, setFormBusNo] = useState("Bus-101");
  const [formRoute, setFormRoute] = useState("Campus → Angamaly");
  const [formDriver, setFormDriver] = useState("Ravi");
  const [formArrival, setFormArrival] = useState("");
  const [formDeparture, setFormDeparture] = useState("");
  const [formDate, setFormDate] = useState("2026-09-05");
  const [formStatus, setFormStatus] = useState("On Time");
  
  const [message, setMessage] = useState({ text: "", type: "success" });

  // OSRM Map States & Movement Animation Index
  const [osrmRouteCoords, setOsrmRouteCoords] = useState([]);
  const [osrmDistance, setOsrmDistance] = useState("16.5 km");
  const [osrmDuration, setOsrmDuration] = useState("34 mins");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const totalDistRef = useRef(16.5);
  const averageSpeedKmh = 30;

  const mapRef = useRef(null);
  const leafletMapInstance = useRef(null);
  const busMarkerRef = useRef(null);
  const polylineRef = useRef(null);

  const removeDuplicates = (list) => {
    const seen = new Set();
    return list.filter(item => {
      const identifier = `${item.busNumber}_${item.date}`;
      if (seen.has(identifier)) return false;
      seen.add(identifier);
      return true;
    });
  };

  useEffect(() => {
    const saved = localStorage.getItem("gateStaffTravelHistoryData");
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        setTravelHistory(removeDuplicates(parsed)); 
      } catch (e) { 
        console.error(e); 
      }
    } else {
      setTravelHistory(removeDuplicates(initialTravelHistory));
    }
  }, []);

  // Fetch OSRM route dynamically
  useEffect(() => {
    if (activeTab === "tracking") {
      setCurrentStepIndex(0);
      const activeBusObj = fleetBuses.find(b => b.id === selectedTrackingBus) || fleetBuses[0];
      const fetchRoute = async () => {
        try {
          const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${activeBusObj.coords[1]},${activeBusObj.coords[0]};${activeBusObj.destCoords[1]},${activeBusObj.destCoords[0]}?overview=full&geometries=geojson`);
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
            const r = data.routes[0];
            const distKm = r.distance / 1000;
            const durMins = Math.ceil(r.duration / 60);

            totalDistRef.current = distKm;
            setOsrmDistance(distKm.toFixed(1) + " km");
            setOsrmDuration(durMins + " mins");
            setOsrmRouteCoords(r.geometry.coordinates.map(c => [c[1], c[0]]));
          }
        } catch (err) {
          totalDistRef.current = 16.5;
          setOsrmDistance("16.5 km");
          setOsrmDuration("34 mins");
          setOsrmRouteCoords([activeBusObj.coords, activeBusObj.destCoords]);
        }
      };
      fetchRoute();
    }
  }, [activeTab, selectedTrackingBus]);

  // Leaflet map initialization
  useEffect(() => {
    if (activeTab === "tracking" && window.L && mapRef.current) {
      if (!leafletMapInstance.current) {
        const map = window.L.map(mapRef.current, { zoomControl: false }).setView([10.19, 76.38], 12);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
        window.L.control.zoom({ position: 'bottomright' }).addTo(map);
        leafletMapInstance.current = map;
      } else {
        leafletMapInstance.current.invalidateSize();
      }
    }
  }, [activeTab]);

  // Live Bus Movement Animation
  useEffect(() => {
    let interval = null;
    if (activeTab === "tracking" && osrmRouteCoords.length > 0) {
      interval = setInterval(() => {
        setCurrentStepIndex((prevIndex) => {
          const totalSteps = osrmRouteCoords.length - 1;
          const nextIndex = prevIndex >= totalSteps ? 0 : prevIndex + 1;
          const progressRatio = nextIndex / (totalSteps || 1);
          const remainingDist = Math.max(0, totalDistRef.current * (1 - progressRatio));
          const calculatedMins = Math.ceil((remainingDist / averageSpeedKmh) * 60);

          setOsrmDistance(remainingDist.toFixed(1) + " km");
          setOsrmDuration(Math.max(1, calculatedMins) + " mins");

          return nextIndex;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTab, osrmRouteCoords]);

  // Update Map Polyline & Marker
  useEffect(() => {
    if (leafletMapInstance.current && osrmRouteCoords.length > 0 && window.L) {
      const map = leafletMapInstance.current;
      if (polylineRef.current) map.removeLayer(polylineRef.current);
      if (busMarkerRef.current) map.removeLayer(busMarkerRef.current);

      polylineRef.current = window.L.polyline(osrmRouteCoords, { color: '#1a73e8', weight: 6, opacity: 0.85 }).addTo(map);

      const currentLatLng = osrmRouteCoords[currentStepIndex] || osrmRouteCoords[0];
      const busIcon = window.L.divIcon({
        className: 'custom-bus-icon',
        html: `<div style="background-color: #0c2340; color: white; padding: 6px 12px; border-radius: 20px; font-weight: bold; font-size: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.4); border: 2px solid white; white-space: nowrap;">🚌 ${selectedTrackingBus} (Moving)</div>`,
        iconSize: [140, 40],
        iconAnchor: [70, 20]
      });

      busMarkerRef.current = window.L.marker(currentLatLng, { icon: busIcon }).addTo(map);
      
      if (currentStepIndex === 0) {
        map.fitBounds(polylineRef.current.getBounds(), { padding: [50, 50] });
      }
    }
  }, [osrmRouteCoords, currentStepIndex, selectedTrackingBus]);

  // Save or Update Gate Record
  const handleSaveRecord = (e) => {
    e.preventDefault();

    const matchingFleetBus = fleetBuses.find(b => b.id === formBusNo);
    if (!matchingFleetBus) {
      setMessage({ text: `Error: Bus number ${formBusNo} is not registered in database.`, type: "error" });
      return;
    }

    if (editingReportId) {
      // Update existing record
      const updated = travelHistory.map(item => {
        if (item.reportId === editingReportId) {
          return {
            ...item,
            busNumber: formBusNo,
            route: formRoute,
            driver: formDriver,
            arrivalTime: formArrival || "Pending",
            departureTime: formDeparture || "Pending",
            date: formDate,
            status: formStatus
          };
        }
        return item;
      });
      setTravelHistory(updated);
      localStorage.setItem("gateStaffTravelHistoryData", JSON.stringify(updated));
      setMessage({ text: `Gate record ${editingReportId} successfully updated!`, type: "success" });
      setEditingReportId(null);
    } else {
      // Create new record
      const isDuplicate = travelHistory.some(item => item.busNumber === formBusNo && item.date === formDate);
      if (isDuplicate) {
        setMessage({ text: `Duplicate Entry Prevented: Travel record for ${formBusNo} on date ${formDate} already exists!`, type: "error" });
        return;
      }

      const newReport = {
        reportId: "REP-" + Math.floor(506 + Math.random() * 400),
        busNumber: formBusNo,
        route: formRoute,
        driver: formDriver,
        arrivalTime: formArrival || "Pending",
        departureTime: formDeparture || "Pending",
        date: formDate,
        status: formStatus
      };

      const updated = removeDuplicates([newReport, ...travelHistory]);
      setTravelHistory(updated);
      localStorage.setItem("gateStaffTravelHistoryData", JSON.stringify(updated));
      setMessage({ text: `Gate travel record ${newReport.reportId} successfully recorded for ${formBusNo}!`, type: "success" });
    }

    // Reset form fields
    setFormArrival("");
    setFormDeparture("");
    setActiveTab("history");
  };

  const handleStartEdit = (item) => {
    setEditingReportId(item.reportId);
    setFormBusNo(item.busNumber);
    setFormRoute(item.route);
    setFormDriver(item.driver);
    setFormArrival(item.arrivalTime === "Pending" ? "" : item.arrivalTime);
    setFormDeparture(item.departureTime === "Pending" ? "" : item.departureTime);
    setFormDate(item.date);
    setFormStatus(item.status);
    setActiveTab("entry");
  };

  const handleLogout = () => navigate("/stafflogin");

  const filteredHistory = travelHistory.filter(item => {
    const matchesSearch = 
      item.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reportId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesDate = !dateFilter || item.date === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerTitleContainer}>
          <div style={styles.logoIcon}>🛡️</div>
          <div>
            <h1 style={styles.headerTitle}>FISAT Main Gate Security Portal</h1>
            <p style={styles.headerSubtitle}>Gate Transit Logging & Fleet Tracking</p>
          </div>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>Log out</button>
      </header>

      <div style={styles.heroBanner}>
        <div style={styles.heroOverlayContent}>
          <span style={styles.badgeLabel}>Security Gate Terminal</span>
          <h2 style={styles.heroTitle}>Welcome, {staff.name}</h2>
          <p style={styles.heroSubText}>Staff ID: <strong>{staff.staffId}</strong> | {staff.department} • Federal Institute of Science and Technology</p>
        </div>
      </div>

      <div style={styles.tabContainerOuter}>
        <div style={styles.tabContainer}>
          <button style={{ ...styles.tabButton, ...(activeTab === "overview" ? styles.activeTab : {}) }} onClick={() => setActiveTab("overview")}>
            🛡️ Guard Overview
          </button>
          <button style={{ ...styles.tabButton, ...(activeTab === "tracking" ? styles.activeTab : {}) }} onClick={() => setActiveTab("tracking")}>
            🗺️ Live Bus Tracking
          </button>
          <button style={{ ...styles.tabButton, ...(activeTab === "history" ? styles.activeTab : {}) }} onClick={() => setActiveTab("history")}>
            📋 Travel History & Search
          </button>
          <button style={{ ...styles.tabButton, ...(activeTab === "entry" ? styles.activeTab : {}) }} onClick={() => { setEditingReportId(null); setActiveTab("entry"); }}>
            ✏️ Gate Record Entry
          </button>
        </div>
      </div>

      <main style={styles.mainContent}>
        {message.text && (
          <div style={{ ...styles.alertBanner, backgroundColor: message.type === "error" ? "#fee2e2" : "#dcfce7", color: message.type === "error" ? "#b91c1c" : "#166534" }}>
            <span>{message.text}</span>
            <button onClick={() => setMessage({ text: "", type: "success" })} style={styles.closeAlert}>&times;</button>
          </div>
        )}

        {activeTab === "overview" && (
          <div style={styles.cardGrid}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Gate Staff Profile Details</h3>
              <div style={styles.infoRow}><strong>Staff Name:</strong> <span>{staff.name}</span></div>
              <div style={styles.infoRow}><strong>Gate ID:</strong> <span style={{ color: "#1a73e8", fontWeight: "bold" }}>{staff.staffId}</span></div>
              <div style={styles.infoRow}><strong>Designation:</strong> <span>{staff.designation}</span></div>
              <div style={styles.infoRow}><strong>Duty Station:</strong> <span>{staff.department}</span></div>
              <div style={styles.infoRow}><strong>Emergency Contact:</strong> <span>{staff.contact}</span></div>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Gatekeeper Guidelines</h3>
              <p style={{ color: "#475569", lineHeight: "1.6" }}>
                Monitor live bus movements along active OSRM routes, filter historical transit records, and log or update morning arrival and evening departure times flexibly.
              </p>
              <button onClick={() => setActiveTab("entry")} style={styles.actionBtn}>New Gate Entry →</button>
            </div>
          </div>
        )}

        {activeTab === "tracking" && (
          <div style={styles.card}>
            <div style={styles.mapHeaderBar}>
              <div>
                <h3 style={{ ...styles.cardTitle, margin: 0 }}>Live GPS Fleet Tracking</h3>
                <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "4px 0 0 0" }}>Bus marker updates position dynamically along the route.</p>
              </div>
              <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}>
                <select 
                  value={selectedTrackingBus} 
                  onChange={(e) => setSelectedTrackingBus(e.target.value)} 
                  style={styles.busSelectorDropdown}
                >
                  {fleetBuses.map(b => (
                    <option key={b.id} value={b.id}>{b.id} ({b.routeName}) - Driver: {b.driver}</option>
                  ))}
                </select>
                <div style={styles.badgeBox}>
                  <span>Remaining Distance: <strong>{osrmDistance}</strong></span> | <span>ETA: <strong style={{ color: "#1a73e8" }}>{osrmDuration}</strong></span>
                </div>
              </div>
            </div>
            <div ref={mapRef} style={{ width: "100%", height: "480px", borderRadius: "10px", zIndex: 1 }}></div>
          </div>
        )}

        {activeTab === "history" && (
          <div style={styles.card}>
            <div style={styles.historyHeaderFlex}>
              <div>
                <h3 style={{ ...styles.cardTitle, margin: 0 }}>Gate Transit History & Search</h3>
                <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "4px 0 0 0" }}>Search records and update morning arrival or evening departure details.</p>
              </div>
              <div style={styles.searchFilterGroup}>
                <input 
                  type="text" 
                  placeholder="Search bus, route, driver..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
                <input 
                  type="date" 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  style={styles.dateInput}
                />
                {dateFilter && (
                  <button onClick={() => setDateFilter("")} style={styles.clearDateBtn}>✕</button>
                )}
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={styles.statusDropdown}
                >
                  <option value="All">All Status</option>
                  <option value="On Time">On Time</option>
                  <option value="Delayed">Delayed</option>
                </select>
              </div>
            </div>

            <div style={{ overflowX: "auto", marginTop: "20px" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>REPORT ID</th>
                    <th style={styles.th}>BUS NUMBER</th>
                    <th style={styles.th}>ROUTE</th>
                    <th style={styles.th}>DRIVER</th>
                    <th style={styles.th}>MORNING ARRIVAL</th>
                    <th style={styles.th}>EVENING DEPARTURE</th>
                    <th style={styles.th}>DATE</th>
                    <th style={styles.th}>STATUS</th>
                    <th style={styles.th}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.length === 0 ? (
                    <tr><td colSpan="9" style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>No matching travel records found.</td></tr>
                  ) : (
                    filteredHistory.map((item) => (
                      <tr key={item.reportId}>
                        <td style={styles.td}><strong>{item.reportId}</strong></td>
                        <td style={styles.td}><span style={styles.busPill}>{item.busNumber}</span></td>
                        <td style={styles.td}>{item.route}</td>
                        <td style={styles.td}>{item.driver}</td>
                        <td style={styles.td}>
                          <span style={{ color: item.arrivalTime === "Pending" ? "#94a3b8" : "#334155", fontStyle: item.arrivalTime === "Pending" ? "italic" : "normal" }}>
                            {item.arrivalTime}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span style={{ color: item.departureTime === "Pending" ? "#94a3b8" : "#334155", fontStyle: item.departureTime === "Pending" ? "italic" : "normal" }}>
                            {item.departureTime}
                          </span>
                        </td>
                        <td style={styles.td}><strong>{item.date}</strong></td>
                        <td style={styles.td}>
                          <span style={{ 
                            ...styles.statusBadge, 
                            backgroundColor: item.status === "On Time" ? "#dcfce7" : "#fee2e2",
                            color: item.status === "On Time" ? "#166534" : "#b91c1c"
                          }}>
                            {item.status}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <button onClick={() => handleStartEdit(item)} style={styles.updateRowBtn}>
                            ✏️ Update
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "entry" && (
          <div style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
              <h3 style={styles.cardTitle}>{editingReportId ? `Update Record (${editingReportId})` : "New Gate Record Entry"}</h3>
              {editingReportId && (
                <button onClick={() => { setEditingReportId(null); setFormArrival(""); setFormDeparture(""); }} style={styles.cancelEditBtn}>
                  Cancel Edit
                </button>
              )}
            </div>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "20px" }}>
              {editingReportId ? "Modify morning arrival or evening departure times as needed." : "Morning arrival and evening departure times are optional and can be filled or left blank to update later."}
            </p>
            <form onSubmit={handleSaveRecord} style={styles.formGrid}>
              <div style={styles.inputField}>
                <label style={styles.label}>Select Bus Number (Database Fleet)</label>
                <select value={formBusNo} onChange={(e) => {
                  const selectedId = e.target.value;
                  setFormBusNo(selectedId);
                  const found = fleetBuses.find(b => b.id === selectedId);
                  if (found) { 
                    setFormRoute(found.routeName); 
                    setFormDriver(found.driver); 
                  }
                }} style={styles.input}>
                  {fleetBuses.map(b => <option key={b.id} value={b.id}>{b.id} — {b.routeName}</option>)}
                </select>
              </div>
              <div style={styles.inputField}>
                <label style={styles.label}>Route Description</label>
                <input type="text" value={formRoute} onChange={(e) => setFormRoute(e.target.value)} style={styles.input} required />
              </div>
              <div style={styles.inputField}>
                <label style={styles.label}>Driver Name</label>
                <input type="text" value={formDriver} onChange={(e) => setFormDriver(e.target.value)} style={styles.input} required />
              </div>
              <div style={styles.inputField}>
                <label style={styles.label}>Morning Arrival Time (Optional)</label>
                <input type="text" placeholder="e.g. 07:50 AM (Leave blank to update later)" value={formArrival} onChange={(e) => setFormArrival(e.target.value)} style={styles.input} />
              </div>
              <div style={styles.inputField}>
                <label style={styles.label}>Evening Departure Time (Optional)</label>
                <input type="text" placeholder="e.g. 03:45 PM (Leave blank to update later)" value={formDeparture} onChange={(e) => setFormDeparture(e.target.value)} style={styles.input} />
              </div>
              <div style={styles.inputField}>
                <label style={styles.label}>Date</label>
                <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} style={styles.input} required />
              </div>
              <div style={styles.inputField}>
                <label style={styles.label}>Trip Status</label>
                <select value={formStatus} onChange={(e) => setFormStatus(e.target.value)} style={styles.input}>
                  <option value="On Time">On Time</option>
                  <option value="Delayed">Delayed</option>
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1", textAlign: "right", marginTop: "10px" }}>
                <button type="submit" style={styles.submitBtn}>{editingReportId ? "Save Changes" : "Save Gate Record"}</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f4f7f6", fontFamily: "'Inter', sans-serif" },
  header: { backgroundColor: "#0c2340", color: "#ffffff", padding: "15px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
  headerTitleContainer: { display: "flex", alignItems: "center", gap: "15px" },
  logoIcon: { width: "45px", height: "45px", borderRadius: "50%", backgroundColor: "#ffc107", color: "#0c2340", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.3rem" },
  headerTitle: { margin: 0, fontSize: "1.3rem", fontWeight: 800 },
  headerSubtitle: { margin: "2px 0 0 0", fontSize: "0.8rem", color: "#cbd5e1" },
  logoutBtn: { backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "#ffffff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: 600 },
  
  heroBanner: { 
    position: "relative", 
    width: "100%", 
    height: "200px", 
    backgroundImage: `linear-gradient(rgba(12, 35, 64, 0.78), rgba(12, 35, 64, 0.88)), url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80')`, 
    backgroundSize: "cover", 
    backgroundPosition: "center", 
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#ffffff",
    padding: "0 20px"
  },
  heroOverlayContent: { maxWidth: "700px" },
  badgeLabel: { backgroundColor: "#ffc107", color: "#0c2340", padding: "3px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", display: "inline-block", marginBottom: "8px" },
  heroTitle: { margin: "0 0 6px 0", fontSize: "1.8rem", fontWeight: "800" },
  heroSubText: { margin: 0, fontSize: "0.95rem", color: "#e2e8f0" },

  tabContainerOuter: { maxWidth: "1200px", margin: "-25px auto 25px auto", padding: "0 20px", position: "relative", zIndex: 10 },
  tabContainer: { display: "flex", gap: "10px", backgroundColor: "#ffffff", padding: "10px", borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.06)" },
  tabButton: { flex: 1, padding: "12px 10px", backgroundColor: "#f1f5f9", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", color: "#475569", transition: "all 0.2s", textAlign: "center", whiteSpace: "nowrap", fontSize: "0.9rem" },
  activeTab: { backgroundColor: "#0c2340", color: "#ffffff" },

  mainContent: { maxWidth: "1200px", margin: "0 auto 50px auto", padding: "0 20px" },
  cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "25px" },
  card: { backgroundColor: "#ffffff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", marginBottom: "25px" },
  cardTitle: { margin: "0 0 15px 0", fontSize: "1.25rem", color: "#0c2340", fontWeight: "700" },
  infoRow: { padding: "10px 0", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", fontSize: "0.95rem", color: "#334155" },
  actionBtn: { marginTop: "15px", backgroundColor: "#1a73e8", color: "#ffffff", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" },
  
  mapHeaderBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", flexWrap: "wrap", gap: "15px" },
  busSelectorDropdown: { padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontWeight: "600", fontSize: "0.9rem", color: "#0c2340" },
  badgeBox: { backgroundColor: "#f8fafc", padding: "8px 15px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem" },

  historyHeaderFlex: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px", marginBottom: "10px" },
  searchFilterGroup: { display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" },
  searchInput: { padding: "8px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.9rem", width: "210px" },
  dateInput: { padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.9rem", backgroundColor: "#fff" },
  clearDateBtn: { background: "#e2e8f0", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", fontWeight: "bold", color: "#334155" },
  statusDropdown: { padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.9rem", backgroundColor: "#fff" },

  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: { padding: "12px 10px", borderBottom: "2px solid #e2e8f0", fontSize: "0.8rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" },
  td: { padding: "14px 10px", borderBottom: "1px solid #f1f5f9", fontSize: "0.9rem", color: "#334155" },
  busPill: { backgroundColor: "#e0f2fe", color: "#0369a1", padding: "4px 10px", borderRadius: "6px", fontWeight: "600", fontSize: "0.85rem" },
  statusBadge: { padding: "4px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "700" },
  updateRowBtn: { backgroundColor: "#e0f2fe", color: "#0369a1", border: "none", padding: "6px 12px", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" },
  cancelEditBtn: { backgroundColor: "#fee2e2", color: "#b91c1c", border: "none", padding: "6px 12px", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" },

  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" },
  inputField: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "0.85rem", fontWeight: "600", color: "#475569" },
  input: { padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.95rem" },
  submitBtn: { backgroundColor: "#16a34a", color: "#ffffff", border: "none", padding: "12px 25px", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "1rem" },
  
  alertBanner: { padding: "12px 20px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", fontWeight: "600" },
  closeAlert: { background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "inherit" }
};