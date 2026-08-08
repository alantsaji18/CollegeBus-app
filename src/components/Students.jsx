import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Students.css";

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([
    {
      id: "FST-001",
      name: "Rahul Kumar",
      rollNo: "MCA101",
      route: "ALuva",
      stop: "Town Hall",
      busNumber: "Bus-101",
      department: "MCA",
      className: "S3 MCA",
      contactNumber: "9876543210",
    },
    {
      id: "FST-002",
      name: "Ayan Das",
      rollNo: "EEE105",
      route: "Thrissur",
      stop: "Chalakudy PUB",
      busNumber: "Bus-102",
      department: "B-Tech ",
      className: "S6 EEE",
      contactNumber: "9865231905",
    },
    {
      id: "FST-003",
      name: "Rohan Mehta",
      rollNo: "MECH101",
      route: "Ernakulam",
      stop: "Marine Drive",
      busNumber: "Bus-108",
      department: "B-Tech ",
      className: "S6 MECH",
      contactNumber: "9876587105",
    },
    {
      id: "FST-004",
      name: "Rekha Sharma",
      rollNo: "IMCA110",
      route: "Muvattupuzha",
      stop: "Town Junction",
      busNumber: "Bus-106",
      department: "IMCA",
      className: "S1 IMCA",
      contactNumber: "8815643210",
    }
  ]);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    rollNo: "",
    route: "",
    stop: "",
    busNumber: "",
    department: "",
    className: "",
    contactNumber: "",
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

    const isDuplicate = students.some(
      (s) => s.id.toLowerCase() === formData.id.toLowerCase() || 
             s.rollNo.toLowerCase() === formData.rollNo.toLowerCase()
    );

    if (isDuplicate) {
      setErrorMsg("Student ID or Roll Number already exists! No duplication allowed.");
      return;
    }

    setStudents([...students, formData]);
    setFormData({
      id: "",
      name: "",
      rollNo: "",
      route: "",
      stop: "",
      busNumber: "",
      department: "",
      className: "",
      contactNumber: "",
    });
    setErrorMsg("");
  };

  const handleDelete = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      student.id.toLowerCase().includes(query) ||
      student.name.toLowerCase().includes(query) ||
      student.rollNo.toLowerCase().includes(query) ||
      student.route.toLowerCase().includes(query) ||
      student.stop.toLowerCase().includes(query) ||
      student.busNumber.toLowerCase().includes(query) ||
      student.department.toLowerCase().includes(query) ||
      student.className.toLowerCase().includes(query) ||
      student.contactNumber.toLowerCase().includes(query)
    );
  });

  return (
    <div className="students-page">
      <div className="students-header">
        <h2>Student Management Portal</h2>
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="students-layout">
        <div className="form-card">
          <div className="form-card-header" style={{ marginBottom: "20px", borderBottom: "1px solid #e5e7eb", paddingBottom: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#1f2937" }}>Register New Student</h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.875rem", color: "#6b7280" }}>Enter student transport and academic details below</p>
          </div>

          {errorMsg && <div className="error-banner">{errorMsg}</div>}
          
          <form onSubmit={handleRegister}>
            <div className="form-grid">
              <div className="form-group">
                <label>Student ID</label>
                <input
                  type="text"
                  name="id"
                  placeholder="e.g. FST-002"
                  value={formData.id}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Roll Number</label>
                <input
                  type="text"
                  name="rollNo"
                  placeholder="e.g. FIT25MCS-2006"
                  value={formData.rollNo}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  placeholder="e.g. B-TECH CSE"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Class / Year</label>
                <input
                  type="text"
                  name="className"
                  placeholder="e.g. S4 CS"
                  value={formData.className}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Route</label>
                <input
                  type="text"
                  name="route"
                  placeholder="e.g. Route THRISSUR"
                  value={formData.route}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Stop</label>
                <input
                  type="text"
                  name="stop"
                  placeholder="e.g. Potta Junction"
                  value={formData.stop}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Bus Number</label>
                <input
                  type="text"
                  name="busNumber"
                  placeholder="e.g. Bus-101"
                  value={formData.busNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  placeholder="e.g. 9876543210"
                  value={formData.contactNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
              <button type="submit" className="submit-reg-btn" style={{ width: "200px", padding: "10px 16px", fontWeight: "600", letterSpacing: "0.025em" }}>Register Student</button>
            </div>
          </form>
        </div>

        <div className="table-card">
          <div className="table-header-flex">
            <h3>Registered Students ({filteredStudents.length})</h3>
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
                  <th>ID</th>
                  <th>Name</th>
                  <th>Roll No</th>
                  <th>Dept / Class</th>
                  <th>Route / Stop</th>
                  <th>Bus</th>
                  <th>Contact</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td><strong>{student.name}</strong></td>
                      <td>{student.rollNo}</td>
                      <td>{student.department} <br/><small>{student.className}</small></td>
                      <td>{student.route} <br/><small>{student.stop}</small></td>
                      <td>{student.busNumber}</td>
                      <td>{student.contactNumber}</td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(student.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">No matching students found.</td>
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

export default Students;