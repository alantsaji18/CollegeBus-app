import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import bus1 from "../assets/bus1.png";
import bus2 from "../assets/bus2.png";
import busBanner from "../assets/bus3.png"; 
import bus3 from "../assets/bus-banner.png"; 
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", trips: 48 },
  { name: "Tue", trips: 46 },
  { name: "Wed", trips: 48 },
  { name: "Thu", trips: 45 },
  { name: "Fri", trips: 47 },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [reportSearch, setReportSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const travelReports = [
    { id: "Bus-101", route: "Campus → Angamaly", driver: "Ravi", arrival: "07:50 AM", departure: "03:45 PM", status: "On Time", class: "status-on-time" },
    { id: "Bus-102", route: "Campus → Ernakulam", driver: "Arun", arrival: "08:05 AM", departure: "03:55 PM", status: "Delayed", class: "status-delayed" },
    { id: "Bus-103", route: "Campus → Chalakkudy", driver: "Meeran", arrival: "07:55 AM", departure: "03:50 PM", status: "On Time", class: "status-on-time" },
    { id: "Bus-104", route: "Campus → Kothamangalam", driver: "Arjun", arrival: "08:10 AM", departure: "03:40 PM", status: "Delayed", class: "status-delayed" },
    { id: "Bus-105", route: "Campus → Muvattupuzha", driver: "Athul", arrival: "08:00 AM", departure: "03:50 PM", status: "On Time", class: "status-on-time" },
  ];

  const filteredReports = travelReports.filter((report) => {
    const q = reportSearch.toLowerCase();
    return (
      report.id.toLowerCase().includes(q) ||
      report.route.toLowerCase().includes(q) ||
      report.driver.toLowerCase().includes(q) ||
      report.arrival.toLowerCase().includes(q) ||
      report.departure.toLowerCase().includes(q) ||
      report.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="admin-dashboard">

      {/* 🔥 Professional Top Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">BusManagement</div>
        <ul className="nav-links">
          <li><Link to="/students">Students</Link></li>
          <li><Link to="/viewbus">Buses</Link></li>
          <li><Link to="/viewdriver">Staff</Link></li>
          <li><Link to="/livetracking">Live Tracking</Link></li>
        </ul>
        <div className="nav-right">
          <span className="notification-bell" title="Notifications">🔔</span>
          <button 
            className="auth-btn" 
            onClick={() => setIsLoggedIn(!isLoggedIn)}
          >
            {isLoggedIn ? "Logout" : "Login"}
          </button>
        </div>
      </nav>

      {/* 🔥 Banner with Fully Visible Bus */}
      <div className="dashboard-banner">
        <img src={busBanner} alt="Bus Banner" className="banner-img" />
        <div className="banner-text">
          <h2>College Bus Management System</h2>
          <p>Track, Manage & Monitor Transport</p>
        </div>
      </div>

      {/* 🔥 Cards */}
      <div className="dashboard-cards">
        <div className="dashboard-card" onClick={() => navigate("/students")} style={{ cursor: "pointer" }}>
          <img src={bus1} alt="Bus 1" className="h2-img-size" />
          <div>
            <h3>Students</h3>
            <p>800</p>
          </div>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/viewbus")} style={{ cursor: "pointer" }}>
          <img src={bus2} alt="Bus 2" className="h2-img-size" />
          <div>
            <h3>Buses</h3>
            <p>24</p>
          </div>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/viewdriver")} style={{ cursor: "pointer" }}>
          <img src={bus3} alt="Bus 3" className="h2-img-size" />
          <div>
            <h3>Staff</h3>
            <p>5</p>
          </div>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/livetracking")} style={{ cursor: "pointer" }}>
          <img src={bus1} alt="Live Tracking" className="h2-img-size" />
          <div>
            <h3>Live Tracking</h3>
            <p>Live</p>
          </div>
        </div>
      </div>

      {/* 🔥 Content */}
      <div className="dashboard-content">

        {/* Chart */}
        <div className="chart-section">
          <h2>Trips Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="trips" fill="#4f46e5" radius={[5,5,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Vehicle Details */}
        <div className="vehicle-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <h2 style={{ margin: 0 }}>Vehicle Details</h2>
            <button 
              onClick={() => navigate("/viewbus")} 
              style={{ background: "#4f46e5", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600" }}
            >
              Show More
            </button>
          </div>

          <div className="vehicle-card">
            <img src={bus1} alt="Bus-101" className="h2-img-size" />
            <div>
              <h4>Bus-101</h4>
              <p>Capacity: 50</p>
              <span className="status-active">Active</span>
            </div>
          </div>

          <div className="vehicle-card">
            <img src={bus2} alt="Bus-102" className="h2-img-size" />
            <div>
              <h4>Bus-102</h4>
              <p>Capacity: 40</p>
              <span className="status-maintenance">Maintenance</span>
            </div>
          </div>

          <div className="vehicle-card">
            <img src={bus3} alt="Bus-103" className="h2-img-size" />
            <div>
              <h4>Bus-103</h4>
              <p>Capacity: 60</p>
              <span className="status-active">Active</span>
            </div>
          </div>

        </div>
      </div>

      {/* 🔥 Table */}
      <div className="table-section">
        <div className="table-header-flex" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h2 style={{ margin: 0 }}>Recent Travel Reports</h2>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search reports..."
              className="students-search-box"
              style={{ padding: "6px 12px", borderRadius: "4px", border: "1px solid #d1d5db" }}
              value={reportSearch}
              onChange={(e) => setReportSearch(e.target.value)}
            />
            <button type="button" className="filter-btn" style={{ padding: "6px 12px", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "4px", cursor: "pointer" }}>Filter</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Route</th>
              <th>Driver</th>
              <th>Arrival Time</th>
              <th>Departure Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report, index) => (
                <tr key={index}>
                  <td>{report.id}</td>
                  <td>{report.route}</td>
                  <td>{report.driver}</td>
                  <td>{report.arrival}</td>
                  <td>{report.departure}</td>
                  <td className={report.class}>{report.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data" style={{ textAlign: "center", padding: "20px" }}>No matching travel reports found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AdminDashboard;