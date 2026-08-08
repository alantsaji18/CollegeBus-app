import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  return (
    <div className="admin-dashboard">

      {/* 🔥 Professional Top Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">BusManagement</div>
        <ul className="nav-links">
          <li><Link to="/students">Students</Link></li>
          <li><a href="#buses">Buses</a></li>
          <li><a href="#staff">Staff</a></li>
          <li><a href="#live-tracking">Live Tracking</a></li>
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
        <div className="dashboard-card">
          <img src={bus1} alt="Bus 1" className="h2-img-size" />
          <div>
            <h3>Students</h3>
            <p>800</p>
          </div>
        </div>

        <div className="dashboard-card">
          <img src={bus2} alt="Bus 2" className="h2-img-size" />
          <div>
            <h3>Buses</h3>
            <p>24</p>
          </div>
        </div>

        <div className="dashboard-card">
          <img src={bus3} alt="Bus 3" className="h2-img-size" />
          <div>
            <h3>Staff</h3>
            <p>5</p>
          </div>
        </div>

        <div className="dashboard-card">
          <img src={bus1} alt="Live Tracking" className="h2-img-size" />
          <div>
            <h3>Live Tracking</h3>
            <p>Live</p>
          </div>
        </div>
      </div>

      {/* 🔥 Professional Search & Filter Toolbar */}
      <div className="top-bar">
        <form className="search-group" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search vehicles or routes..."
            className="search-box"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="search-submit-btn">Search</button>
        </form>
        <button type="button" className="filter-btn">Filter</button>
      </div>

      {/* Display Search Query Result */}
      {searchQuery && (
        <div className="search-result-display">
          <p>Showing search results for: <strong>{searchQuery}</strong></p>
        </div>
      )}

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
          <h2>Vehicle Details</h2>

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
        <h2>Recent Travel Reports</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Route</th>
              <th>Driver</th>
              <th>Arrival Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Bus-101</td>
              <td>Campus → Angamaly</td>
              <td>Ravi</td>
              <td>07:50 AM</td>
              <td className="status-on-time">On Time</td>
            </tr>
            <tr>
              <td>Bus-102</td>
              <td>Campus → Ernakulam</td>
              <td>Arun</td>
              <td>08:05 AM</td>
              <td className="status-delayed">Delayed</td>
            </tr>
            <tr>
              <td>Bus-103</td>
              <td>Campus → Chalakkudy</td>
              <td>Meeran</td>
              <td>07:55 AM</td>
              <td className="status-on-time">On Time</td>
            </tr>
            <tr>
              <td>Bus-104</td>
              <td>Campus → Kothamangalam</td>
              <td>Arjun</td>
              <td>08:10 AM</td>
              <td className="status-delayed">Delayed</td>
            </tr>
            <tr>
              <td>Bus-105</td>
              <td>Campus → Muvattupuzha</td>
              <td>Athul</td>
              <td>08:00 AM</td>
              <td className="status-on-time">On Time</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AdminDashboard;