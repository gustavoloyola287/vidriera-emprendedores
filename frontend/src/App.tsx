import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Page/Home";
import Login from "./Page/Login";
import RegistroEmprendedor from "./Page/RegistroEmprendedor";
import DetalleEmprendedor from "./Page/DetalleEmprendedor";

function App() {
    return (
        <BrowserRouter>
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