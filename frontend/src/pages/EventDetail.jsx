import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Clock } from 'lucide-react';

const EventDetail = () => {
  const { id } = useParams();

  // Dummy Data (Nanti diganti API)
  const event = {
    id: 1,
    title: "Evoria Music Festival 2024",
    image: "https://images.unsplash.com/photo-1459749411177-8c27590ff838?auto=format&fit=crop&q=80&w=1000",
    description: "Nikmati malam penuh alunan musik indie dari artis-artis papan atas Indonesia. Evoria Music Festival menghadirkan pengalaman konser outdoor yang tak terlupakan dengan tata panggung spektakuler.",
    date: "20 Desember 2024",
    time: "19:00 WIB",
    location: "PKOR Way Halim, Bandar Lampung",
    price: 150000,
    quota: 45,
    category: "Music"
  };

  return (
    // ✅ SUDAH BERSIH: Tidak ada <Navbar /> disini karena sudah ada di App.jsx
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Hero Image */}
      <div className="w-full h-[400px] relative">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end">
              <div className="max-w-7xl mx-auto px-4 pb-10 w-full text-white">
                  <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                      {event.category}
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold font-outfit mb-2">{event.title}</h1>
                  <div className="flex flex-wrap gap-4 text-sm md:text-base opacity-90">
                      <span className="flex items-center gap-1"><Calendar size={18}/> {event.date}</span>
                      <span className="flex items-center gap-1"><Clock size={18}/> {event.time}</span>
                      <span className="flex items-center gap-1"><MapPin size={18}/> {event.location}</span>
                  </div>
              </div>
          </div>
      </div>

      {/* Content & Booking */}
      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Kiri: Deskripsi */}
          <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4 font-outfit">Tentang Acara</h2>
                  <p className="text-slate-600 leading-relaxed text-justify font-poppins">
                      {event.description}
                  </p>
              </div>
          </div>

          {/* Kanan: Booking Card */}
          <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-blue-600 sticky top-24">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 font-outfit">Informasi Tiket</h3>
                  
                  <div className="flex justify-between items-center mb-4">
                      <span className="text-slate-500">Harga Tiket</span>
                      <span className="text-2xl font-bold text-blue-600">Rp {event.price.toLocaleString('id-ID')}</span>
                  </div>

                  <div className="flex justify-between items-center mb-6 text-sm">
                      <span className="text-slate-500">Sisa Kuota</span>
                      <span className="font-semibold text-orange-500">{event.quota} Tiket</span>
                  </div>

                  <Link 
                      to={`/booking/${event.id}`} 
                      className="block w-full bg-blue-600 text-white text-center py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                  >
                      Book Now
                  </Link>
                  <p className="text-xs text-center text-slate-400 mt-3">Pembayaran aman & terpercaya</p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default EventDetail;