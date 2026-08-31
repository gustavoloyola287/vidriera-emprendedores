import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from './components/Navbar';
import Home from "./page/Home";
import { Login } from "./page/Login";
import RegistroEmprendedor from "./page/RegistroEmprendedor";
import DetalleEmprendedor from "./page/DetalleEmprendedor";
import { ProductosPage } from "./page/ProductosPage";
import  Footer  from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { RecuperarPassword } from "./page/RecuperarPassword";
import { RestablecerPassword } from "./page/RestablecerPassword";

function App() {
    return (
    <AuthProvider>
        <BrowserRouter>
            <Navbar />

            {/* Encapsulamos las rutas dentro del main para que empuje al footer */}
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<RegistroEmprendedor />} />
                    <Route path="/emprendedor/:id" element={<DetalleEmprendedor />} />
                    <Route path="/recuperar-password" element={<RecuperarPassword />} />
                    <Route path="/restablecer-password" element={<RestablecerPassword />} />



                    {/* Ruta protegida de productos */}
                    <Route 
                        path="/productos" 
                        element={<ProtectedRoute><ProductosPage /> </ProtectedRoute>} />
                </Routes>

                
            </main>

            {/* Footer */}
            <Footer />
        </BrowserRouter>
        </AuthProvider>
    );
}

export default App;