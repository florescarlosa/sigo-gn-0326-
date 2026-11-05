import { useEffect, useState } from 'react';

function Expedientes() {
    const [expedientes, setExpedientes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const [formulario, setFormulario] = useState({
        folio: '',
        operativo: '',
        tipoIncidente: '',
        zona: '',
        fecha: '',
        descripcion: ''
    });

    const [mensaje, setMensaje] = useState('');
    const [editando, setEditando] = useState(false);

    // Consultar todos los expedientes
    const cargarExpedientes = async () => {
        try {
            const respuesta = await fetch(
                'http://localhost:4000/expedientes'
            );

            if (!respuesta.ok) {
                throw new Error('No se pudieron consultar los expedientes');
            }

            const datos = await respuesta.json();

            setExpedientes(datos);
            setError('');

        } catch (error) {
            setError('No se pudo conectar con el servidor');
            console.error(error);

        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarExpedientes();
    }, []);

    // Detectar cambios en los campos del formulario
    function manejarCambio(e) {
        const { name, value } = e.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    }

    // Cargar expediente para editar
    function editarExpediente(expediente) {
        setFormulario({
            folio: expediente.folio,
            operativo: expediente.operativo,
            tipoIncidente: expediente.tipoIncidente,
            zona: expediente.zona,
            fecha: expediente.fecha,
            descripcion: expediente.descripcion
        });

        setEditando(true);
        setMensaje('');

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Crear o actualizar un expediente
    async function crearExpediente(e) {
        e.preventDefault();
        setMensaje('');

        try {
            const url = editando
                ? `http://localhost:4000/expedientes/${formulario.folio}`
                : 'http://localhost:4000/expedientes';

            const respuesta = await fetch(url, {
                method: editando ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formulario)
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(resultado.mensaje);
            }

            setMensaje(
                editando
                    ? 'Expediente actualizado correctamente'
                    : 'Expediente creado correctamente'
            );

            limpiarFormulario();

            await cargarExpedientes();

        } catch (error) {
            setMensaje(error.message);
        }
    }

    // Eliminar un expediente
    async function eliminarExpediente(folio) {
        const confirmar = window.confirm(
            `¿Estás seguro de eliminar el expediente ${folio}?`
        );

        if (!confirmar) {
            return;
        }

        try {
            const respuesta = await fetch(
                `http://localhost:4000/expedientes/${folio}`,
                {
                    method: 'DELETE'
                }
            );

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(resultado.mensaje);
            }

            setMensaje('Expediente eliminado correctamente');

            await cargarExpedientes();

        } catch (error) {
            setMensaje(error.message);
        }
    }

    // Limpiar formulario
    function limpiarFormulario() {
        setFormulario({
            folio: '',
            operativo: '',
            tipoIncidente: '',
            zona: '',
            fecha: '',
            descripcion: ''
        });

        setEditando(false);
    }

    return (
        <div className="expedientes-container">

            <h1>Módulo de Expedientes</h1>

            <p>Gestión de expedientes de operativos SIGO-GN</p>

            <h2>
                {editando
                    ? 'Editar expediente'
                    : 'Registrar nuevo expediente'}
            </h2>

            <form onSubmit={crearExpediente}>

                <label>Folio:</label>

                <input
                    type="text"
                    name="folio"
                    placeholder="EXP-2026600326-001"
                    value={formulario.folio}
                    onChange={manejarCambio}
                    required
                    readOnly={editando}
                    pattern="EXP-[0-9]{10}-[0-9]{3}"
                    title="Formato: EXP-boleta-###"
                />

                <label>Nombre del operativo:</label>

                <input
                    type="text"
                    name="operativo"
                    value={formulario.operativo}
                    onChange={manejarCambio}
                    required
                />

                <label>Tipo de incidente:</label>

                <input
                    type="text"
                    name="tipoIncidente"
                    value={formulario.tipoIncidente}
                    onChange={manejarCambio}
                    required
                />

                <label>Zona:</label>

                <input
                    type="text"
                    name="zona"
                    value={formulario.zona}
                    onChange={manejarCambio}
                    required
                />

                <label>Fecha:</label>

                <input
                    type="date"
                    name="fecha"
                    value={formulario.fecha}
                    onChange={manejarCambio}
                    required
                />

                <label>Descripción:</label>

                <textarea
                    name="descripcion"
                    value={formulario.descripcion}
                    onChange={manejarCambio}
                    required
                />

                <button type="submit" className="btn-primary">
                    {editando
                        ? 'Actualizar expediente'
                        : 'Guardar expediente'}
                </button>

                {editando && (
                    <button
                        type="button"
                        onClick={limpiarFormulario}
                    >
                        Cancelar edición
                    </button>
                )}

            </form>

            {mensaje && <p>{mensaje}</p>}

            <h2>Expedientes registrados</h2>

            {cargando && <p>Cargando expedientes...</p>}

            {error && <p>{error}</p>}

            {!cargando && !error && (

                <table>

                    <thead>
                        <tr>
                            <th>Folio</th>
                            <th>Operativo</th>
                            <th>Tipo de incidente</th>
                            <th>Zona</th>
                            <th>Fecha</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>

                        {expedientes.length === 0 ? (

                            <tr>
                                <td colSpan="7">
                                    No hay expedientes registrados.
                                </td>
                            </tr>

                        ) : (

                            expedientes.map((expediente) => (

                                <tr key={expediente.folio}>

                                    <td>{expediente.folio}</td>
                                    <td>{expediente.operativo}</td>
                                    <td>{expediente.tipoIncidente}</td>
                                    <td>{expediente.zona}</td>
                                    <td>{expediente.fecha}</td>
                                    <td>{expediente.descripcion}</td>

                                    <td>
                                        <button
                                            type="button"
                                            onClick={() => editarExpediente(expediente)}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => eliminarExpediente(expediente.folio)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            )}

        </div>
    );
}

export default Expedientes;
