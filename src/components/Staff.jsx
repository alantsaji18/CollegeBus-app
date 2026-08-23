import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Students.css";

const Staff = () => {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState([
    {
      staffId: "STF-001",
      name: "Ravi",
      password: "password123",
      designation: "Driver",
      phoneNumber: "9876543210",
      experience: "5 Years",
    },
    {
      staffId: "STF-002",
      name: "Suresh Kumar",
      password: "password123",
      designation: "GateStaff",
      phoneNumber: "9812345678",
      experience: "3 Years",
    },
  ]);

  const [formData, setFormData] = useState({
    staffId: "",
    name: "",
    password: "",
    designation: "Driver",
    phoneNumber: "",
    experience: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // 1. Check for empty fields
    for (let key in formData) {
      if (!formData[key].trim()) {
        setErrorMsg("All fields must be filled!");
        return;
      }
    }

    // 2. Validate phone number (must be exactly 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phoneNumber.trim())) {
      setErrorMsg("Phone number must be exactly 10 digits!");
      return;
    }

    // 3. Check for duplicate Staff ID
    const isDuplicate = staffList.some(
      (s) => s.staffId.toLowerCase() === formData.staffId.toLowerCase()
    );

    if (isDuplicate) {
      setErrorMsg("Staff ID already exists! No duplication allowed.");
      return;
    }

    setStaffList([...staffList, formData]);
    setFormData({
      staffId: "",
      name: "",
      password: "",
      designation: "Driver",
      phoneNumber: "",
      experience: "",
    });
    setErrorMsg("");
  };

  const handleDelete = (staffId) => {
    setStaffList(staffList.filter((staff) => staff.staffId !== staffId));
  };

  const filteredStaff = staffList.filter((staff) => {
    const query = searchQuery.toLowerCase();
    return (
      staff.staffId.toLowerCase().includes(query) ||
      staff.name.toLowerCase().includes(query) ||
      staff.designation.toLowerCase().includes(query) ||
      staff.phoneNumber.toLowerCase().includes(query) ||
      staff.experience.toLowerCase().includes(query) ||
      staff.password.toLowerCase().includes(query)
    );
  });

  return (
    <div className="students-page">
      <div className="students-header">
        <h2>Staff Management Portal</h2>
        <button className="back-btn" onClick={() => navigate("/admin")}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="students-layout">
        <div className="form-card">
          <div className="form-card-header" style={{ marginBottom: "20px", borderBottom: "1px solid #e5e7eb", paddingBottom: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#1f2937" }}>Register New Staff</h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.875rem", color: "#6b7280" }}>Enter staff credentials and professional details below</p>
          </div>

          {errorMsg && <div className="error-banner">{errorMsg}</div>}
          
          <form onSubmit={handleRegister}>
            <div className="form-grid">
              <div className="form-group">
                <label>Staff ID</label>
                <input
                  type="text"
                  name="staffId"
                  placeholder="e.g. STF-003"
                  value={formData.staffId}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter staff name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Designation</label>
                <select name="designation" value={formData.designation} onChange={handleChange}>
                  <option value="Driver">Driver</option>
                  <option value="GateStaff">GateStaff</option>
                </select>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="e.g. 9876543210"
                  maxLength="10"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Experience</label>
                <input
                  type="text"
                  name="experience"
                  placeholder="e.g. 5 Years"
                  value={formData.experience}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
              <button type="submit" className="submit-reg-btn" style={{ width: "200px", padding: "10px 16px", fontWeight: "600", letterSpacing: "0.025em" }}>Register Staff</button>
            </div>
          </form>
        </div>

        <div className="table-card">
          <div className="table-header-flex">
            <h3>Registered Staff ({filteredStaff.length})</h3>
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
                  <th>Staff ID</th>
                  <th>Name</th>
                  <th>Password</th>
                  <th>Designation</th>
                  <th>Phone Number</th>
                  <th>Experience</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((staff) => (
                    <tr key={staff.staffId}>
                      <td><strong>{staff.staffId}</strong></td>
                      <td>{staff.name}</td>
                      <td>{staff.password}</td>
                      <td>
                        <span style={{ color: staff.designation === "GateStaff" ? "green" : "#b45309", fontWeight: "bold" }}>
                          {staff.designation}
                        </span>
                      </td>
                      <td>{staff.phoneNumber}</td>
                      <td>{staff.experience}</td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(staff.staffId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">No matching staff found.</td>
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

export default Staff;