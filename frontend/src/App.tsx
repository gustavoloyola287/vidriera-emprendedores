import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from './Components/Navbar';
import Home from "./Page/Home";
import Login from "./Page/Login";
import RegistroEmprendedor from "./Page/RegistroEmprendedor";
import DetalleEmprendedor from "./Page/DetalleEmprendedor";
import { ProductosPage } from "./Page/ProductosPage";
import { AuthProvider } from './Context/AuthContext';
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
                <Route path="/productos" element={<ProductosPage />} />
            </Routes>
        </BrowserRouter>
        </AuthProvider>
    );
}

export default App;