import { useEffect, useState } from 'react';
import './Expedientes.css';
import { tienePermiso } from '../utils/permisos';

function Expedientes() {
    const usuarioActual = JSON.parse(localStorage.getItem('sigoUsuario') || 'null');
    const rolUsuario = usuarioActual?.rol || '';
    const puedeEscribir = tienePermiso(rolUsuario, 2);
    const puedeEliminar = tienePermiso(rolUsuario, 1);
    const [expedientes, setExpedientes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const [formulario, setFormulario] = useState({
        folio: '',
        operativo: '',
        tipoIncidente: '',
        zona: '',
        fecha: '',
        descripcion: '',
        estatus: '',
        prioridad: ''
    });

    const [mensaje, setMensaje] = useState('');
    const [editando, setEditando] = useState(false);
    const [textoBusqueda, setTextoBusqueda] = useState('');

    // Estados para los filtros
    const [filtroEstatus, setFiltroEstatus] = useState('');
    const [filtroPrioridad, setFiltroPrioridad] = useState('');

    // Estados para el ordenamiento
    const [columnaOrden, setColumnaOrden] = useState('');
    const [direccionOrden, setDireccionOrden] = useState('asc');

    // Estado para la paginación
    const [paginaActual, setPaginaActual] = useState(1);

    const expedientesPorPagina = 10;

    // Consultar expedientes o realizar una búsqueda
    async function cargarExpedientes(texto = '') {
        try {
            const url = texto.trim()
                ? `http://localhost:4000/expedientes/buscar?texto=${encodeURIComponent(texto)}`
                : 'http://localhost:4000/expedientes';

            const respuesta = await fetch(url);

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
    }

    // Cargar expedientes al entrar al módulo
    useEffect(() => {
        cargarExpedientes();
    }, []);

    // Buscar mientras el usuario escribe
    useEffect(() => {
        const temporizador = setTimeout(() => {
            cargarExpedientes(textoBusqueda);
        }, 400);

        return () => clearTimeout(temporizador);
    }, [textoBusqueda]);

    // Reiniciar la página cuando cambien los filtros o la búsqueda
    useEffect(() => {
        setPaginaActual(1);
    }, [textoBusqueda, filtroEstatus, filtroPrioridad]);

    // Detectar cambios en los campos
    function manejarCambio(e) {
        const { name, value } = e.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    }

    // Ordenar expedientes al pulsar un encabezado
    function manejarOrdenamiento(columna) {
        if (columnaOrden === columna) {
            setDireccionOrden(
                direccionOrden === 'asc' ? 'desc' : 'asc'
            );
        } else {
            setColumnaOrden(columna);
            setDireccionOrden('asc');
        }

        setPaginaActual(1);
    }

    // Cargar expediente para editar
    function editarExpediente(expediente) {
        setFormulario({
            folio: expediente.folio,
            operativo: expediente.operativo,
            tipoIncidente: expediente.tipoIncidente,
            zona: expediente.zona,
            fecha: expediente.fecha,
            descripcion: expediente.descripcion,
            estatus: expediente.estatus,
            prioridad: expediente.prioridad
        });

        setEditando(true);
        setMensaje('');

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Crear o actualizar expediente
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
                    'Content-Type': 'application/json',
                    'x-rol': rolUsuario
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
            setPaginaActual(1);
            await cargarExpedientes(textoBusqueda);

        } catch (error) {
            setMensaje(error.message);
        }
    }

    // Eliminar expediente
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
                    method: 'DELETE',
                    headers: {
                        'x-rol': rolUsuario
                    }
                }
            );

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(resultado.mensaje);
            }

            setMensaje('Expediente eliminado correctamente');

            await cargarExpedientes(textoBusqueda);

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
            descripcion: '',
            estatus: '',
            prioridad: ''
        });

        setEditando(false);
    }

    // Aplicar filtros
    let expedientesMostrados = expedientes.filter((expediente) => {

        const coincideEstatus =
            filtroEstatus === '' ||
            expediente.estatus === filtroEstatus;

        const coincidePrioridad =
            filtroPrioridad === '' ||
            expediente.prioridad === filtroPrioridad;

        return coincideEstatus && coincidePrioridad;
    });

    // Aplicar ordenamiento
    if (columnaOrden !== '') {

        expedientesMostrados = [...expedientesMostrados].sort((a, b) => {

            let comparacion = 0;

            if (columnaOrden === 'folio') {
                comparacion = a.folio.localeCompare(b.folio);
            }

            if (columnaOrden === 'fechaCreacion') {
                comparacion =
                    new Date(a.fechaCreacion) -
                    new Date(b.fechaCreacion);
            }

            if (columnaOrden === 'prioridad') {

                const ordenPrioridad = {
                    Alta: 1,
                    Media: 2,
                    Baja: 3
                };

                comparacion =
                    ordenPrioridad[a.prioridad] -
                    ordenPrioridad[b.prioridad];
            }

            return direccionOrden === 'asc'
                ? comparacion
                : -comparacion;
        });
    }

    // Calcular la cantidad de páginas
    const totalPaginas = Math.ceil(
        expedientesMostrados.length / expedientesPorPagina
    );

    // Evitar páginas fuera del rango disponible
    const paginaSegura = Math.min(
        paginaActual,
        Math.max(totalPaginas, 1)
    );

    // Obtener los expedientes de la página actual
    const indiceInicial =
        (paginaSegura - 1) * expedientesPorPagina;

    const indiceFinal =
        indiceInicial + expedientesPorPagina;

    const expedientesPaginados =
        expedientesMostrados.slice(indiceInicial, indiceFinal);

    // Cambiar de página
    function cambiarPagina(nuevaPagina) {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            setPaginaActual(nuevaPagina);
        }
    }

    return (
        <div className="expedientes-container">

            <h1>Módulo de Expedientes</h1>

            <p>Gestión de expedientes de operativos SIGO-GN</p>

            {puedeEscribir && (
            <>
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

                <label>Estatus:</label>

                <select
                    name="estatus"
                    value={formulario.estatus}
                    onChange={manejarCambio}
                    required
                >
                    <option value="">Selecciona un estatus</option>
                    <option value="Abierto">Abierto</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Cerrado">Cerrado</option>
                </select>

                <label>Prioridad:</label>

                <select
                    name="prioridad"
                    value={formulario.prioridad}
                    onChange={manejarCambio}
                    required
                >
                    <option value="">Selecciona una prioridad</option>
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                </select>

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
            </>
            )}

            {mensaje && <p>{mensaje}</p>}

            <h2>Expedientes registrados</h2>

            <div className="busqueda-expedientes">

                <label htmlFor="buscarExpediente">
                    Buscar expediente:
                </label>

                <input
                    id="buscarExpediente"
                    type="text"
                    placeholder="Buscar por folio, operativo o descripción..."
                    value={textoBusqueda}
                    onChange={(e) => setTextoBusqueda(e.target.value)}
                />

            </div>

            <div className="filtros-expedientes">

                <label htmlFor="filtroEstatus">
                    Filtrar por estatus:
                </label>

                <select
                    id="filtroEstatus"
                    value={filtroEstatus}
                    onChange={(e) => setFiltroEstatus(e.target.value)}
                >
                    <option value="">Todos los estatus</option>
                    <option value="Abierto">Abierto</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Cerrado">Cerrado</option>
                </select>

                <label htmlFor="filtroPrioridad">
                    Filtrar por prioridad:
                </label>

                <select
                    id="filtroPrioridad"
                    value={filtroPrioridad}
                    onChange={(e) => setFiltroPrioridad(e.target.value)}
                >
                    <option value="">Todas las prioridades</option>
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                </select>

            </div>

            {cargando && <p>Cargando expedientes...</p>}

            {error && <p>{error}</p>}

            {!cargando && !error && (

                <div className="tabla-expedientes">

                    <table>

                        <thead>
                            <tr>

                                <th>
                                    <button
                                        type="button"
                                        onClick={() => manejarOrdenamiento('folio')}
                                    >
                                        Folio {columnaOrden === 'folio'
                                            ? (direccionOrden === 'asc' ? '↑' : '↓')
                                            : ''}
                                    </button>
                                </th>

                                <th>Operativo</th>
                                <th>Tipo de incidente</th>
                                <th>Zona</th>
                                <th>Fecha</th>
                                <th>Descripción</th>
                                <th>Estatus</th>

                                <th>
                                    <button
                                        type="button"
                                        onClick={() => manejarOrdenamiento('prioridad')}
                                    >
                                        Prioridad {columnaOrden === 'prioridad'
                                            ? (direccionOrden === 'asc' ? '↑' : '↓')
                                            : ''}
                                    </button>
                                </th>

                                <th>
                                    <button
                                        type="button"
                                        onClick={() => manejarOrdenamiento('fechaCreacion')}
                                    >
                                        Fecha de creación {columnaOrden === 'fechaCreacion'
                                            ? (direccionOrden === 'asc' ? '↑' : '↓')
                                            : ''}
                                    </button>
                                </th>

                                {(puedeEscribir || puedeEliminar) && <th>Acciones</th>}

                            </tr>
                        </thead>

                        <tbody>

                            {expedientesMostrados.length === 0 ? (

                                <tr>
                                    <td colSpan={puedeEscribir || puedeEliminar ? 10 : 9}>
                                        No hay expedientes que coincidan con los filtros.
                                    </td>
                                </tr>

                            ) : (

                                expedientesPaginados.map((expediente) => (

                                    <tr key={expediente.folio}>

                                        <td>{expediente.folio}</td>
                                        <td>{expediente.operativo}</td>
                                        <td>{expediente.tipoIncidente}</td>
                                        <td>{expediente.zona}</td>
                                        <td>{expediente.fecha}</td>
                                        <td>{expediente.descripcion}</td>

                                        <td>
                                            <span className={`estatus-badge ${expediente.estatus.toLowerCase().replace(' ', '-')}`}>
                                                {expediente.estatus}
                                            </span>
                                        </td>

                                        <td>{expediente.prioridad}</td>

                                        <td>
                                            {new Date(expediente.fechaCreacion).toLocaleDateString('es-MX')}
                                        </td>

                                        {(puedeEscribir || puedeEliminar) && (
                                            <td>
                                                {puedeEscribir && (
                                                    <button
                                                        type="button"
                                                        onClick={() => editarExpediente(expediente)}
                                                    >
                                                        Editar
                                                    </button>
                                                )}

                                                {puedeEliminar && (
                                                    <button
                                                        type="button"
                                                        onClick={() => eliminarExpediente(expediente.folio)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                )}
                                            </td>
                                        )}

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                    {expedientesMostrados.length > 0 && (

                        <div className="paginacion-expedientes">

                            <button
                                type="button"
                                onClick={() => cambiarPagina(paginaSegura - 1)}
                                disabled={paginaSegura === 1}
                            >
                                Anterior
                            </button>

                            <span>
                                Página {paginaSegura} de {totalPaginas}
                            </span>

                            <button
                                type="button"
                                onClick={() => cambiarPagina(paginaSegura + 1)}
                                disabled={paginaSegura === totalPaginas}
                            >
                                Siguiente
                            </button>

                        </div>

                    )}

                    <p className="total-expedientes">
                        Mostrando {expedientesPaginados.length} de {expedientesMostrados.length} expedientes.
                    </p>

                </div>

            )}

        </div>
    );
}

export default Expedientes;
