// Valores octales equivalentes a los permisos del sistema de archivos.
const permisosPorRol = {
    Comandante: 7, // rwx: leer, escribir y eliminar
    Oficial: 6,     // rw-: leer y escribir
    Analista: 4     // r--: solo leer
};

// accionRequerida: 4 = leer, 2 = escribir, 1 = eliminar
export function tienePermiso(rolUsuario, accionRequerida) {
    const permisos = permisosPorRol[rolUsuario] ?? 0;
    return (permisos & accionRequerida) === accionRequerida;
}

export default permisosPorRol;
