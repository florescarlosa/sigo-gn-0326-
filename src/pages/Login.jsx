import { useState } from "react";
import usuarios from "../data/usuarios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  
    function manejarInicioSesion(e) {
        e.preventDefault();

        const usuarioEncontrado = usuarios.find(
          (u) =>
            u.usuario === usuario &&
            u.contrasena === contrasena
        );

    if (usuarioEncontrado) {
        const { contrasena, ...datosUsuario } = usuarioEncontrado;

        localStorage.setItem(
            "sigoUsuario",
            JSON.stringify(datosUsuario)
        );
        
        setError("");
        navigate("/dashboard");
    } else {
        setError("Usuario o contraseña incorrectos.");
    }
}


  return (
    <section className="page-card">
      <h2>Iniciar sesión</h2>

      <p className="page-description">
        Ingresa tus datos para acceder al sistema SIGO-GN.
      </p>

      <form onSubmit={manejarInicioSesion}>
        <div className="form-group">
          <label htmlFor="usuario">Usuario</label>
          <input
            id="usuario"
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Escribe tu usuario"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contrasena">Contraseña</label>
          <input
            id="contrasena"
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            placeholder="Escribe tu contraseña"
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          Entrar
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </section>
  );
}

export default Login;
