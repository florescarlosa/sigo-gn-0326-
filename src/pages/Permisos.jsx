import { Navigate } from 'react-router-dom';
import './Permisos.css';

function Permisos() {
    const usuario = JSON.parse(localStorage.getItem('sigoUsuario') || 'null');

    if (!usuario || usuario.rol !== 'Comandante') {
        return <Navigate to="/dashboard" replace />;
    }

    const roles = [
        { rol: 'Comandante', octal: 7, simbolico: 'rwx', descripcion: 'Puede consultar, editar y eliminar expedientes.' },
        { rol: 'Oficial', octal: 6, simbolico: 'rw-', descripcion: 'Puede consultar y editar expedientes, pero no eliminarlos.' },
        { rol: 'Analista', octal: 4, simbolico: 'r--', descripcion: 'Puede consultar expedientes; no puede editarlos ni eliminarlos.' }
    ];

    return (
        <section className="permisos-container">
            <h1>Administración de permisos</h1>
            <p>Equivalencia de permisos octales y simbólicos para los roles de SIGO-GN.</p>
            <table className="tabla-permisos">
                <thead>
                    <tr>
                        <th>Rol</th>
                        <th>Valor octal</th>
                        <th>Permiso simbólico</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map((item) => (
                        <tr key={item.rol}>
                            <td>{item.rol}</td>
                            <td>{item.octal}</td>
                            <td><code>{item.simbolico}</code></td>
                            <td>{item.descripcion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="leyenda-permisos">
                <p><strong>r = 4:</strong> lectura / consultar</p>
                <p><strong>w = 2:</strong> escritura / crear y editar</p>
                <p><strong>x = 1:</strong> ejecución / eliminar en esta práctica</p>
            </div>
        </section>
    );
}

export default Permisos;
