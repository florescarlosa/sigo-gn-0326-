import { Navigate, Outlet } from "react-router-dom";

function RutaProtegida() {
  const usuarioGuardado = localStorage.getItem("sigoUsuario");

  if (!usuarioGuardado) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RutaProtegida;
