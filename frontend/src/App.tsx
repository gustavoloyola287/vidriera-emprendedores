import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from './components/Navbar';
import Home from "./page/Home";
import Login from "./page/Login";
import RegistroEmprendedor from "./page/RegistroEmprendedor";
import DetalleEmprendedor from "./page/DetalleEmprendedor";
import { ProductosPage } from "./page/ProductosPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<RegistroEmprendedor />} />
                <Route path="/emprendedor/:id" element={<DetalleEmprendedor />} />
                <Route path="/productos" element={<ProductosPage />} />

                {/* Ruta protegida */}
                <Route path="/productos" element={<ProtectedRoute><ProductosPage /></ProtectedRoute>} />

                {/* Ruta por defecto */}
               

            </Routes>
        </BrowserRouter>
    );
}

export default App;