import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ExperiencesView } from './pages/ExperiencesView';
import { AccommodationsView } from './pages/AccomodationsView';
import { Availability } from './pages/Availability';
import { VisitorForm } from './pages/VisitorForm';
import { Payment } from './pages/Payment';
import { Confirmation } from './pages/Confirmation';
import { AdminDashboard } from './pages/AdminDashboard';
import { ManageDates } from './pages/ManageDates';
import { ManageCapacity } from './pages/ManageCapacity';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Portal Público */}
        <Route path="/" element={<Home />} />
        <Route path="/alojamientos" element={<AccommodationsView />} />
        <Route path="/experiencias" element={<ExperiencesView />} />
        <Route path="/reserva" element={<Availability />} />
        <Route path="/reserva/datos" element={<VisitorForm />} />
        <Route path="/reserva/pago" element={<Payment />} />
        <Route path="/reserva/confirmacion" element={<Confirmation />} />

        {/* Panel Administrativo */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/fechas" element={<ManageDates />} />
        <Route path="/admin/cupos" element={<ManageCapacity />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;