import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from './Components/Navbar';
import Home from "./Page/Home";
import { Login } from "./Page/Login";
import RegistroEmprendedor from "./Page/RegistroEmprendedor";
import DetalleEmprendedor from "./Page/DetalleEmprendedor";
import { ProductosPage } from "./Page/ProductosPage";
import Footer from "./Components/Footer";
import { ProtectedRoute } from "./Components/ProtectedRoute";
import { AuthProvider } from "./Context/AuthContext";
import { RecuperarPassword } from "./Page/RecuperarPasword";
import { RestablecerPassword } from "./Page/RestablecerPasword";

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