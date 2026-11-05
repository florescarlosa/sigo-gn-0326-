
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RutaProtegida from "./components/RutaProtegida";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Expedientes from "./pages/Expedientes";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Login />} />

          <Route element={<RutaProtegida />}>
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/expedientes"
              element={<Expedientes />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
