import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import shareqr from '../assets/qris/shareqr.png';

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen page-bg flex items-start justify-center py-32 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-white/40 p-6 text-center">
        <h2 className="text-lg font-bold font-outfit text-slate-900 mb-2">Pembayaran via QRIS</h2>
        <p className="text-sm text-slate-600 mb-4">Pembayaran dilakukan melalui QRIS. Scan kode di bawah menggunakan aplikasi dompet digital Anda.</p>

        <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-center mb-4">
          <img src={shareqr} alt="QRIS" className="w-64 h-64 object-contain" />
        </div>

        <button onClick={() => navigate('/my-bookings')} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-md transition">
          Sudah Membayar
        </button>

        <div className="text-xs text-slate-400 mt-4">Booking ID: <span className="font-mono">{bookingId}</span></div>
      </div>
    </div>
  );
}
