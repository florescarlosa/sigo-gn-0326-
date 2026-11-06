import { Link, Outlet } from "react-router-dom";

function Layout() {
  let usuario = null;

  try {
    usuario = JSON.parse(localStorage.getItem("sigoUsuario") || "null");
  } catch {
    usuario = null;
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>SIGO-GN</h1>
        <p>Sistemas Operativos — Gestión de acceso</p>
        <p>Boleta: 2026600326</p>
        {usuario && (
          <nav className="menu-principal">
            <Link to="/dashboard">Inicio</Link>
            <Link to="/expedientes">Expedientes</Link>
            {usuario.rol === "Comandante" && (
              <Link to="/permisos">Permisos</Link>
            )}
          </nav>
        )}
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>Proyecto académico de Sistemas Operativos</p>
      </footer>
    </div>
  );
}

export default Layout;
