import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { dashboardApi, travelReportsApi } from "../services/api";
import "./AdminDashboard.css";

import bus1 from "../assets/bus1.png";
import bus2 from "../assets/bus2.png";
import busBanner from "../assets/bus3.png"; // This is the main banner image
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

  const [stats, setStats] = useState({
    totalStudents: 800,
    totalBuses: 24,
    totalStaff: 5,
    onTimeRate: "98.5%",
  });

  // Travel History state
  const [travelReports, setTravelReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardApi.getStats();

        if (data) {
          setStats({
            totalStudents: data.totalStudents,
            totalBuses: data.totalBuses,
            totalStaff: data.totalStaff,
            onTimeRate: data.onTimeRate || "98.5%",
          });
        }
      } catch (err) {
        console.warn("Could not fetch live dashboard stats", err);
      }
    };

    fetchStats();
  }, []);

  /*
    ============================================================
    FETCH TRAVEL HISTORY FROM DJANGO
    ============================================================
  */

  useEffect(() => {
    const fetchTravelReports = async () => {
      try {
        setReportsLoading(true);

        const data = await travelReportsApi.getAll();

        if (Array.isArray(data)) {
          setTravelReports(data);
        } else if (data && Array.isArray(data.results)) {
          setTravelReports(data.results);
        } else {
          setTravelReports([]);
        }
      } catch (err) {
        console.error("Could not fetch travel reports", err);
        setTravelReports([]);
      } finally {
        setReportsLoading(false);
      }
    };

    fetchTravelReports();
  }, []);

  /*
    ============================================================
    FILTER TRAVEL REPORTS
    ============================================================
  */

  const filteredReports = travelReports.filter((report) => {
    const q = reportSearch.toLowerCase();

    const busId = String(
      report.busNumber ||
        report.busNo ||
        report.id ||
        ""
    ).toLowerCase();

    const route = String(report.route || "").toLowerCase();

    const driver = String(
      report.driver ||
        report.driverName ||
        ""
    ).toLowerCase();

    const arrival = String(
      report.arrivalTime ||
        report.arrival ||
        ""
    ).toLowerCase();

    const departure = String(
      report.departureTime ||
        report.departure ||
        ""
    ).toLowerCase();

    const date = String(report.date || "").toLowerCase();

    const status = String(
      report.status ||
        ""
    ).toLowerCase();

    return (
      busId.includes(q) ||
      route.includes(q) ||
      driver.includes(q) ||
      arrival.includes(q) ||
      departure.includes(q) ||
      date.includes(q) ||
      status.includes(q)
    );
  });

  /*
    ============================================================
    LOGOUT
    ============================================================
  */

  const handleLogout = () => {
    // Remove admin login information
    sessionStorage.removeItem("adminLoggedIn");
    sessionStorage.removeItem("adminUsername");

    // Go back to admin login
    navigate("/adminlogin", { replace: true });
  };

  return (
    <div className="admin-dashboard">

      {/* ========================================================
          PROFESSIONAL TOP NAVIGATION BAR
      ======================================================== */}

      <nav className="navbar">

        <div className="nav-brand">
          BusManagement
        </div>

        <ul className="nav-links">

          <li>
            <Link to="/students">
              Students
            </Link>
          </li>

          <li>
            <Link to="/viewbus">
              Buses
            </Link>
          </li>

          <li>
            <Link to="/viewdriver">
              Staff
            </Link>
          </li>

          <li>
            <Link to="/livetracking">
              Live Tracking
            </Link>
          </li>

          <li>
            <Link to="/travelhistory">
              Travel History
            </Link>
          </li>

        </ul>

        <div className="nav-right">

          <span
            className="notification-bell"
            title="Notifications"
          >
            🔔
          </span>

          <button
            className="auth-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* ========================================================
          BANNER (Updated to use the correct asset)
      ======================================================== */}

      <div className="dashboard-banner">

        <img
          src={busBanner}
          alt="Bus Banner"
          className="banner-img"
        />

        <div className="banner-text overlay-text">

          <h2>
            College Bus Management System
          </h2>

          <p>
            Track, Manage & Monitor Transport
          </p>

        </div>

      </div>

      {/* ========================================================
          DASHBOARD CARDS
      ======================================================== */}

      <div className="dashboard-cards">

        {/* Students */}

        <div
          className="dashboard-card"
          onClick={() => navigate("/students")}
          style={{ cursor: "pointer" }}
        >

          <img
            src={bus1}
            alt="Bus 1"
            className="h2-img-size"
          />

          <div>

            <h3>
              Students
            </h3>

            <p>
              {stats.totalStudents}
            </p>

          </div>

        </div>

        {/* Buses */}

        <div
          className="dashboard-card"
          onClick={() => navigate("/viewbus")}
          style={{ cursor: "pointer" }}
        >

          <img
            src={bus2}
            alt="Bus 2"
            className="h2-img-size"
          />

          <div>

            <h3>
              Buses
            </h3>

            <p>
              {stats.totalBuses}
            </p>

          </div>

        </div>

        {/* Staff */}

        <div
          className="dashboard-card"
          onClick={() => navigate("/viewdriver")}
          style={{ cursor: "pointer" }}
        >

          <img
            src={bus3}
            alt="Bus 3"
            className="h2-img-size"
          />

          <div>

            <h3>
              Staff
            </h3>

            <p>
              {stats.totalStaff}
            </p>

          </div>

        </div>

        {/* Live Tracking */}

        <div
          className="dashboard-card"
          onClick={() => navigate("/livetracking")}
          style={{ cursor: "pointer" }}
        >

          <img
            src={bus1}
            alt="Live Tracking"
            className="h2-img-size"
          />

          <div>

            <h3>
              Live Tracking
            </h3>

            <p>
              Live
            </p>

          </div>

        </div>

      </div>

      {/* ========================================================
          CONTENT
      ======================================================== */}

      <div className="dashboard-content">

        {/* ======================================================
            CHART
        ====================================================== */}

        <div className="chart-section">

          <h2>
            Trips Overview
          </h2>

          <ResponsiveContainer
            width="100%"
            height={250}
          >

            <BarChart data={data}>

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="trips"
                fill="#4f46e5"
                radius={[5, 5, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* ======================================================
            VEHICLE DETAILS
        ====================================================== */}

        <div className="vehicle-section">

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >

            <h2
              style={{ margin: 0 }}
            >
              Vehicle Details
            </h2>

            <button
              onClick={() => navigate("/viewbus")}
              style={{
                background: "#4f46e5",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: "600",
              }}
            >
              Show More
            </button>

          </div>

          {/* Bus 101 */}

          <div className="vehicle-card">

            <img
              src={bus1}
              alt="Bus-101"
              className="h2-img-size"
            />

            <div>

              <h4>
                Bus-101
              </h4>

              <p>
                Capacity: 50
              </p>

              <span className="status-active">
                Active
              </span>

            </div>

          </div>

          {/* Bus 102 */}

          <div className="vehicle-card">

            <img
              src={bus2}
              alt="Bus-102"
              className="h2-img-size"
            />

            <div>

              <h4>
                Bus-102
              </h4>

              <p>
                Capacity: 40
              </p>

              <span className="status-maintenance">
                Maintenance
              </span>

            </div>

          </div>

          {/* Bus 103 */}

          <div className="vehicle-card">

            <img
              src={bus3}
              alt="Bus-103"
              className="h2-img-size"
            />

            <div>

              <h4>
                Bus-103
              </h4>

              <p>
                Capacity: 60
              </p>

              <span className="status-active">
                Active
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================================
          RECENT TRAVEL REPORTS
      ======================================================== */}

      <div className="table-section">

        <div
          className="table-header-flex"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >

          <h2
            style={{ margin: 0 }}
          >
            Recent Travel Reports
          </h2>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >

            <input
              type="text"
              placeholder="Search reports..."
              className="students-search-box"
              style={{
                padding: "6px 12px",
                borderRadius: "4px",
                border: "1px solid #d1d5db",
              }}
              value={reportSearch}
              onChange={(e) =>
                setReportSearch(e.target.value)
              }
            />

            <button
              type="button"
              className="filter-btn"
              style={{
                padding: "6px 12px",
                background: "#f3f4f6",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Filter
            </button>

            <button
              type="button"
              onClick={() => navigate("/travelhistory")}
              style={{
                background: "#4f46e5",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: "600",
              }}
            >
              Show More
            </button>

          </div>

        </div>

        <table>

          <thead>

            <tr>

              <th>
                ID
              </th>

              <th>
                Route
              </th>

              <th>
                Driver
              </th>

              <th>
                Date
              </th>

              <th>
                Arrival Time
              </th>

              <th>
                Departure Time
              </th>

              <th>
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {reportsLoading ? (

              <tr>

                <td
                  colSpan="7"
                  className="no-data"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  Loading travel reports...
                </td>

              </tr>

            ) : filteredReports.length > 0 ? (

              filteredReports.map(
                (report, index) => {

                  const reportId =
                    report.busNumber ||
                    report.busNo ||
                    report.id ||
                    "-";

                  const arrival =
                    report.arrivalTime ||
                    report.arrival ||
                    "-";

                  const departure =
                    report.departureTime ||
                    report.departure ||
                    "-";

                  const date = report.date || "-";

                  const driver =
                    report.driver ||
                    report.driverName ||
                    "-";

                  const status =
                    report.status ||
                    "-";

                  const statusClass =
                    status.toLowerCase().includes("delay")
                      ? "status-delayed"
                      : "status-on-time";

                  return (
                    <tr
                      key={report.id || index}
                    >

                      <td>
                        {reportId}
                      </td>

                      <td>
                        {report.route || "-"}
                      </td>

                      <td>
                        {driver}
                      </td>

                      <td>
                        {date}
                      </td>

                      <td>
                        {arrival}
                      </td>

                      <td>
                        {departure}
                      </td>

                      <td className={statusClass}>
                        {status}
                      </td>

                    </tr>
                  );
                }
              )

            ) : (

              <tr>

                <td
                  colSpan="7"
                  className="no-data"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  No matching travel reports found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AdminDashboard;