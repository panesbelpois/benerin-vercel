import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. Import Navbar
import Navbar from './components/Navbar';

// Import Pages Lama
import EventList from './pages/EventList';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardAdmin from './pages/DashboardAdmin';
import NotFound from './pages/NotFound';

// Import Pages Baru (Niscil)
import EventDetail from './pages/EventDetail';
import BookingForm from './pages/BookingForm';
import BookingHistory from './pages/BookingHistory';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <BrowserRouter>
      {/* 2. PASANG NAVBAR DISINI (Di luar Routes) */}
      {/* Ini akan membuat Navbar selalu muncul di halaman mana saja */}
      <Navbar />

      <Routes>
        {/* === Route Publik === */}
        <Route path="/" element={<EventList />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetail />} />
        
        {/* === Route Auth === */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* === Route User === */}
        <Route path="/booking/:id" element={<BookingForm />} />
        <Route path="/my-bookings" element={<BookingHistory />} />
        <Route path="/profile" element={<UserProfile />} />

        {/* === Route Admin === */}
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        
        {/* === Route Error === */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;