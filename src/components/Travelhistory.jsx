import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TravelHistory() {
  const navigate = useNavigate();

  // Initial mock data mirroring the staff travel reports shown on the admin dashboard
  const [reports, setReports] = useState([
    { id: "REP-501", busNo: "Bus-101", route: "Campus → Angamaly", driver: "Ravi", arrivalTime: "07:50 AM", departureTime: "03:45 PM", status: "On Time", date: "2026-09-05" },
    { id: "REP-502", busNo: "Bus-102", route: "Campus → Ernakulam", driver: "Arun", arrivalTime: "08:05 AM", departureTime: "03:55 PM", status: "Delayed", date: "2026-09-05" },
    { id: "REP-503", busNo: "Bus-103", route: "Campus → Chalakkudy", driver: "Meeran", arrivalTime: "07:55 AM", departureTime: "03:50 PM", status: "On Time", date: "2026-09-05" },
    { id: "REP-504", busNo: "Bus-104", route: "Campus → Kothamangalam", driver: "Arjun", arrivalTime: "08:10 AM", departureTime: "03:40 PM", status: "Delayed", date: "2026-09-04" },
    { id: "REP-505", busNo: "Bus-105", route: "Campus → Muvattupuzha", driver: "Athul", arrivalTime: "08:00 AM", departureTime: "03:50 PM", status: "On Time", date: "2026-09-04" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Load any staff-entered logs from localStorage if applicable
  useEffect(() => {
    const savedReports = localStorage.getItem("staffTravelReports");
    if (savedReports) {
      try {
        setReports(JSON.parse(savedReports));
      } catch (err) {
        console.error("Failed to parse travel reports", err);
      }
    }
  }, []);

  const filteredReports = reports.filter((item) => {
    const matchesSearch = 
      item.busNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.driver.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerTitleContainer}>
          <div style={styles.logoIcon}>🚌</div>
          <div>
            <h1 style={styles.headerTitle}>FISAT Admin Portal</h1>
            <p style={styles.headerSubtitle}>Staff Travel Reports & History</p>
          </div>
        </div>
        <button onClick={() => navigate("/admin")} style={styles.backBtn}>
          <i className="fas fa-arrow-left" style={{ marginRight: "6px" }}></i> Back to Dashboard
        </button>
      </header>

      <div style={styles.mainContent}>
        <div style={styles.pageHeaderBox}>
          <div>
            <h2 style={styles.title}>Recent Travel History</h2>
            <p style={styles.subtitle}>Comprehensive archive of all bus trips and logs entered by transit staff.</p>
          </div>
          <div style={styles.filterGroup}>
            <input 
              type="text" 
              placeholder="Search bus, route, driver..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              style={styles.selectFilter}
            >
              <option value="All">All Status</option>
              <option value="On Time">On Time</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>
        </div>

        <div style={styles.card}>
          {filteredReports.length === 0 ? (
            <p style={styles.noDataText}>No travel reports found matching your criteria.</p>
          ) : (
            <div style={styles.tableResponsive}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Report ID</th>
                    <th style={styles.th}>Bus Number</th>
                    <th style={styles.th}>Route</th>
                    <th style={styles.th}>Staff / Driver</th>
                    <th style={styles.th}>Arrival Time</th>
                    <th style={styles.th}>Departure Time</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report.id} style={styles.tr}>
                      <td style={styles.td}><strong>{report.id}</strong></td>
                      <td style={styles.td}><span style={styles.busBadge}>{report.busNo}</span></td>
                      <td style={styles.td}>{report.route}</td>
                      <td style={styles.td}>{report.driver}</td>
                      <td style={styles.td}>{report.arrivalTime}</td>
                      <td style={styles.td}>{report.departureTime}</td>
                      <td style={styles.td}>{report.date}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          color: report.status === "On Time" ? "#16a34a" : "#dc2626",
                          backgroundColor: report.status === "On Time" ? "#f0fdf4" : "#fef2f2",
                          border: `1px solid ${report.status === "On Time" ? "#bbf7d0" : "#fecaca"}`
                        }}>
                          {report.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f4f7f6",
    fontFamily: "'Inter', 'Segoe UI', sans-serif"
  },
  header: {
    backgroundColor: "#0c2340",
    color: "#ffffff",
    padding: "15px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  },
  headerTitleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },
  logoIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    backgroundColor: "#ffc107",
    color: "#0c2340",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.4rem",
    fontWeight: "bold"
  },
  headerTitle: {
    margin: 0,
    fontSize: "1.3rem",
    fontWeight: 800
  },
  headerSubtitle: {
    margin: "2px 0 0 0",
    fontSize: "0.8rem",
    color: "#cbd5e1"
  },
  backBtn: {
    backgroundColor: "transparent",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "#ffffff",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.9rem"
  },
  mainContent: {
    maxWidth: "1200px",
    margin: "30px auto",
    padding: "0 20px"
  },
  pageHeaderBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "15px"
  },
  title: {
    margin: 0,
    fontSize: "1.6rem",
    color: "#0c2340",
    fontWeight: "700"
  },
  subtitle: {
    margin: "4px 0 0 0",
    fontSize: "0.95rem",
    color: "#64748b"
  },
  filterGroup: {
    display: "flex",
    gap: "10px"
  },
  searchInput: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "0.9rem",
    outline: "none",
    width: "220px",
    backgroundColor: "#ffffff"
  },
  selectFilter: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "0.9rem",
    outline: "none",
    backgroundColor: "#ffffff",
    cursor: "pointer"
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0"
  },
  tableResponsive: {
    overflowX: "auto"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left"
  },
  th: {
    padding: "14px 12px",
    backgroundColor: "#f8fafc",
    color: "#475569",
    fontSize: "0.85rem",
    fontWeight: "700",
    borderBottom: "2px solid #e2e8f0",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  tr: {
    transition: "background-color 0.2s"
  },
  td: {
    padding: "16px 12px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "0.95rem",
    color: "#334155"
  },
  busBadge: {
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "0.85rem",
    fontWeight: "600",
    border: "1px solid #bfdbfe"
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "0.80rem",
    fontWeight: "700",
    display: "inline-block"
  },
  noDataText: {
    textAlign: "center",
    padding: "40px",
    color: "#64748b",
    fontSize: "1rem"
  }
};