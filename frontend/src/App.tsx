import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from './components/Navbar';
import Home from "./page/Home";
import { Login } from "./page/Login";
import RegistroEmprendedor from "./page/RegistroEmprendedor";
import DetalleEmprendedor from "./page/DetalleEmprendedor";
import { ProductosPage } from "./page/ProductosPage";
import Footer from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { RecuperarPassword } from "./page/RecuperarPassword";
import { RestablecerPassword } from "./page/RestablecerPassword";
import { CategoriasPage } from "./page/CategoriasPage";
import {EmprendedoresPage} from "./page/EmprendedoresPage";
import { AdminDashboard } from "./page/AdminDashboard";
function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Navbar />

                {/* Encapsulamos las rutas dentro del main para que empuje al footer */}
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/registro" element={<RegistroEmprendedor />} />
                        <Route path="/emprendedor/:id" element={<DetalleEmprendedor />} />
                        <Route path="/recuperar-password" element={<RecuperarPassword />} />
                        <Route path="/restablecer-password" element={<RestablecerPassword />} />
                        <Route path= "/emprendedores" element={<EmprendedoresPage />} />
                        <Route path = "/categorias" element={<CategoriasPage />} />
                        <Route path ="/recuperar-password" element={<RecuperarPassword />} />
                        <Route path ="/restablecer-password" element={<RestablecerPassword />} />
                        <Route path ="/adminDashboard" element={<AdminDashboard />} />
                        {/* Ruta protegida de productos */}
                        <Route 
                            path="/productos" element={ <ProtectedRoute> <ProductosPage /> </ProtectedRoute> }/>
                    </Routes>
                </main>

                {/* Footer */}
                <Footer />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;