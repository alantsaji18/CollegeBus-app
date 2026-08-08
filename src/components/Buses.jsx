import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Students.css";

const Buses = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([
    {
      busId: "Bus-101",
      driverName: "Ravi",
      startingPlace: "Campus",
      endingPlace: "Ernakulam",
      route: "Ernakulam",
      driversContactNumber: "9876543210",
      capacity: "50",
      status: "Active",
    },
    {
      busId: "Bus-102",
      driverName: "Arun",
      startingPlace: "Campus",
      endingPlace: "Thrissur",
      route: "Thrissur",
      driversContactNumber: "9865231905",
      capacity: "45",
      status: "Maintenance",
    },
    {
      busId: "Bus-103",
      driverName: "Meeran",
      startingPlace: "Campus",
      endingPlace: "Chalakkudy",
      route: "Chalakkudy",
      driversContactNumber: "9876543210",
      capacity: "60",
      status: "Maintenance",
    },
    {
      busId: "Bus-104",
      driverName: "Raju",
      startingPlace: "Campus",
      endingPlace: "Muvattupuzha",
      route: "Muvattupuzha",
      driversContactNumber: "9877631910",
      capacity: "40",
      status: "Active",
    },
    {
      busId: "Bus-105",
      driverName: "Rajesh",
      startingPlace: "Campus",
      endingPlace: "Kothamangalam",
      route: "Kothamangalam",
      driversContactNumber: "9876884506",
      capacity: "48",
      status: "Active",
    },
    {
      busId: "Bus-106",
      driverName: "Aravind",
      startingPlace: "Ernakulam",
      endingPlace: "Campus",
      route: "Ernakulam",
      driversContactNumber: "9877013210",
      capacity: "50",
      status: "Maintenance",
    },
  ]);

  const [formData, setFormData] = useState({
    busId: "",
    driverName: "",
    startingPlace: "",
    endingPlace: "",
    route: "",
    driversContactNumber: "",
    capacity: "",
    status: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleRegister = (e) => {
    e.preventDefault();

    for (let key in formData) {
      if (!formData[key].trim()) {
        setErrorMsg("All fields must be filled!");
        return;
      }
    }

    const isDuplicate = buses.some(
      (b) => b.busId.toLowerCase() === formData.busId.toLowerCase()
    );

    if (isDuplicate) {
      setErrorMsg("Bus ID already exists! No duplication allowed.");
      return;
    }

    setBuses([...buses, formData]);
    setFormData({
      busId: "",
      driverName: "",
      startingPlace: "",
      endingPlace: "",
      route: "",
      driversContactNumber: "",
      capacity: "",
      status: "",
    });
    setErrorMsg("");
  };

  const handleDelete = (busId) => {
    setBuses(buses.filter((bus) => bus.busId !== busId));
  };

  const filteredBuses = buses.filter((bus) => {
    const query = searchQuery.toLowerCase();
    return (
      bus.busId.toLowerCase().includes(query) ||
      bus.driverName.toLowerCase().includes(query) ||
      bus.startingPlace.toLowerCase().includes(query) ||
      bus.endingPlace.toLowerCase().includes(query) ||
      bus.route.toLowerCase().includes(query) ||
      bus.driversContactNumber.toLowerCase().includes(query) ||
      bus.capacity.toLowerCase().includes(query) ||
      bus.status.toLowerCase().includes(query)
    );
  });

  return (
    <div className="students-page">
      <div className="students-header">
        <h2>Bus Management Portal</h2>
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="students-layout">
        <div className="form-card">
          <div className="form-card-header" style={{ marginBottom: "20px", borderBottom: "1px solid #e5e7eb", paddingBottom: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#1f2937" }}>Register New Bus</h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.875rem", color: "#6b7280" }}>Enter bus fleet and driver details below</p>
          </div>

          {errorMsg && <div className="error-banner">{errorMsg}</div>}
          
          <form onSubmit={handleRegister}>
            <div className="form-grid">
              <div className="form-group">
                <label>Bus ID</label>
                <input
                  type="text"
                  name="busId"
                  placeholder="e.g. Bus-104"
                  value={formData.busId}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Driver Name</label>
                <input
                  type="text"
                  name="driverName"
                  placeholder="Enter driver name"
                  value={formData.driverName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Starting Place</label>
                <input
                  type="text"
                  name="startingPlace"
                  placeholder="e.g. Campus"
                  value={formData.startingPlace}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Ending Place</label>
                <input
                  type="text"
                  name="endingPlace"
                  placeholder="e.g. Ernakulam"
                  value={formData.endingPlace}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Route</label>
                <input
                  type="text"
                  name="route"
                  placeholder="e.g. Ernakulam"
                  value={formData.route}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Drivers Contact Number</label>
                <input
                  type="text"
                  name="driversContactNumber"
                  placeholder="e.g. 9876543210"
                  value={formData.driversContactNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="text"
                  name="capacity"
                  placeholder="e.g. 50"
                  value={formData.capacity}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
              <button type="submit" className="submit-reg-btn" style={{ width: "200px", padding: "10px 16px", fontWeight: "600", letterSpacing: "0.025em" }}>Register Bus</button>
            </div>
          </form>
        </div>

        <div className="table-card">
          <div className="table-header-flex">
            <h3>Registered Buses ({filteredBuses.length})</h3>
            <input
              type="text"
              placeholder="Search any detail..."
              className="students-search-box"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Bus ID</th>
                  <th>Driver Name</th>
                  <th>Route (Start → End)</th>
                  <th>Contact</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuses.length > 0 ? (
                  filteredBuses.map((bus) => (
                    <tr key={bus.busId}>
                      <td><strong>{bus.busId}</strong></td>
                      <td>{bus.driverName}</td>
                      <td>{bus.startingPlace} → {bus.endingPlace} <br/><small>{bus.route}</small></td>
                      <td>{bus.driversContactNumber}</td>
                      <td>{bus.capacity}</td>
                      <td>
                        <span style={{ color: bus.status === "Active" ? "green" : "orange", fontWeight: "bold" }}>
                          {bus.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(bus.busId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">No matching buses found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buses;