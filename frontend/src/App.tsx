import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from './components/Navbar';
import Home from "./page/Home";
import Login from "./page/Login";
import RegistroEmprendedor from "./page/RegistroEmprendedor";
import DetalleEmprendedor from "./page/DetalleEmprendedor";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />

                <Route
                    path="/registro"
                    element={<RegistroEmprendedor />}
                />

                <Route
                    path="/emprendedor/:id"
                    element={<DetalleEmprendedor />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;