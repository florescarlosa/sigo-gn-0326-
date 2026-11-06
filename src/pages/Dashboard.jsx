
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();

    const usuarioGuardado = localStorage.getItem('sigoUsuario');
    const usuario = usuarioGuardado
        ? JSON.parse(usuarioGuardado)
        : {};

    function cerrarSesion() {
        localStorage.removeItem('sigoUsuario');
        navigate('/');
    }

    return (
        <div className="page-card">

            <h1>Panel de control</h1>

            <p className="page-description">
                Bienvenido al sistema SIGO-GN.
            </p>

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

            <button
                className="btn-primary"
                onClick={() => navigate('/expedientes')}
            >
                Módulo de Expedientes
            </button>

            <button
                onClick={cerrarSesion}
            >
                Cerrar sesión
            </button>

        </div>
    );
}

export default Dashboard;
