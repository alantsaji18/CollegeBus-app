import { useState } from 'react';
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
import "leaflet/dist/leaflet.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/viewbus" element={<Buses />} />
        <Route path="/viewdriver" element={<Staff />} />
        <Route path="/livetracking" element={<LiveTracking />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/studentlogin" element={<StudentLogin />} />
        <Route path="/stafflogin" element={<StaffLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;