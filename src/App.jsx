import { useState } from 'react';
import './App.css';
import AdminDashboard from './components/AdminDashboard';
import Students from './components/Students';
import Buses from './components/Buses';
import "leaflet/dist/leaflet.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/viewbus" element={<Buses />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;