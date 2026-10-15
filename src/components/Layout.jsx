import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="app-container">
      <header className="header">
        <h1>SIGO-GN</h1>
        <p>Sistemas Operativos — Gestión de acceso</p>
        <p>Boleta: 2026600326</p>
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