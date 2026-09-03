import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from './Components/Navbar';
import Home from "./Page/Home";
import { Login } from "./Page/Login";
import RegistroEmprendedor from "./Page/RegistroEmprendedor";
import DetalleEmprendedor from "./Page/DetalleEmprendedor";
import { ProductosPage } from "./Page/ProductosPage";
import Footer from "./Components/Footer";
import { ProtectedRoute } from "./Components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { RecuperarPassword } from "./Page/RecuperarPassword";
import { RestablecerPassword } from "./Page/RestablecerPassword";
import { CategoriasPage } from "./Page/CategoriasPage";
import { EmprendedoresPage } from "./Page/EmprendedoresPage";
import { AdminDashboard } from "./Page/AdminDashboard";
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
                        <Route path="/emprendedores" element={<EmprendedoresPage />} />
                        <Route path="/categorias" element={<CategoriasPage />} />
                        <Route path="/admindashboard" element={<AdminDashboard />} />
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