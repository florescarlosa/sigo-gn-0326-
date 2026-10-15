import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  function cerrarSesion() {
    localStorage.removeItem("sigoUsuario");
    navigate("/");
  }

  const datosGuardados = localStorage.getItem("sigoUsuario");
  const usuario = datosGuardados
    ? JSON.parse(datosGuardados)
    : null;

  return (
    <section className="page-card">
      <h2>Panel de control</h2>

      <p className="page-description">
        Bienvenido al sistema SIGO-GN.
      </p>

      {usuario && (
        <div className="user-info">
          <p>
            <strong>Nombre:</strong> {usuario.nombre}
          </p>

          <p>
            <strong>Usuario:</strong> {usuario.usuario}
          </p>

          <p>
            <strong>Rol:</strong> {usuario.rol}
          </p>
        </div>
      )}

      <button
        type="button"
        className="btn-primary"
        onClick={cerrarSesion}
      >
        Cerrar sesión
      </button>
    </section>
  );
}

export default Dashboard;
