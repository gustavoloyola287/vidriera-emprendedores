
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import Navbar from './Components/Navbar';
import Home from './Page/Home';
import Login from './Page/Login';
import RegistroEmprendedor from './Page/RegistroEmprendedor';
import DetalleEmprendedor from './Page/DetalleEmprendedor';

function App() {
    return (
    <AuthProvider>
        <BrowserRouter>
        <Navbar />
        
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<RegistroEmprendedor />} />
            <Route path="/emprendedor/:id" element={<DetalleEmprendedor />} />
            </Routes>
        </BrowserRouter>
        </AuthProvider>
    );
}

export default App;