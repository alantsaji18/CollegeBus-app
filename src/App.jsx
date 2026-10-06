import './App.css';
import AdminDashboard from './components/AdminDashboard';
import Students from './components/Students';
import Buses from './components/Buses';
import Staff from './components/Staff';
import LiveTracking from './components/LiveTracking';
import Home from './components/home';
import AdminLogin from './components/AdminLogin';
import StudentLogin from './components/StudentLogin';
import StaffLogin from './components/StaffLogin';
import StudentDashboard from './components/StudentDashboard';
import TravelHistory from './components/Travelhistory';
import StaffDashboard from './components/StaffDashboard';
import "leaflet/dist/leaflet.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function RequireStudentAuth({ children }) {
  let student;
  try {
    student = JSON.parse(sessionStorage.getItem("loggedInStudent"));
  } catch {
    student = null;
  }

  return student ? children : <Navigate to="/studentlogin" replace />;
}

function RequireSession({ storageKey, loginPath, children }) {
  const isAuthenticated = sessionStorage.getItem(storageKey) === "true";

  return isAuthenticated ? children : <Navigate to={loginPath} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<RequireSession storageKey="adminLoggedIn" loginPath="/adminlogin"><AdminDashboard /></RequireSession>} />
        <Route path="/admindashboard" element={<RequireSession storageKey="adminLoggedIn" loginPath="/adminlogin"><AdminDashboard /></RequireSession>} />
        <Route path="/students" element={<RequireSession storageKey="adminLoggedIn" loginPath="/adminlogin"><Students /></RequireSession>} />
        <Route path="/student-dashboard" element={<RequireStudentAuth><StudentDashboard /></RequireStudentAuth>} />
        <Route path="/studentsdashboard" element={<RequireStudentAuth><StudentDashboard /></RequireStudentAuth>} />
        <Route path="/viewbus" element={<RequireSession storageKey="adminLoggedIn" loginPath="/adminlogin"><Buses /></RequireSession>} />
        <Route path="/viewdriver" element={<RequireSession storageKey="adminLoggedIn" loginPath="/adminlogin"><Staff /></RequireSession>} />
        <Route path="/livetracking" element={<RequireSession storageKey="adminLoggedIn" loginPath="/adminlogin"><LiveTracking /></RequireSession>} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/studentlogin" element={<StudentLogin />} />
        <Route path="/stafflogin" element={<StaffLogin />} />
        <Route path="/travelhistory" element={<RequireSession storageKey="adminLoggedIn" loginPath="/adminlogin"><TravelHistory /></RequireSession>} />
        <Route path="/staff-dashboard" element={<RequireSession storageKey="staffLoggedIn" loginPath="/stafflogin"><StaffDashboard /></RequireSession>} />
        <Route path="/staffdashboard" element={<RequireSession storageKey="staffLoggedIn" loginPath="/stafflogin"><StaffDashboard /></RequireSession>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;