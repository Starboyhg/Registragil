// import Logo from "./imgs/RAC_logo.jpg";
import Logo from "./imgs/RA_logo.png";
import { Link, useNavigate } from "react-router-dom";
import "./CSS/BarraSuperior.css";

export function BarraSuperior() {
  const navigate = useNavigate();
  return (
    <>
      <ul className="BarraSuperior">
        <li className="Bloque Izquierda">
          <Link to={"Bienvenida"}>
            <img src={Logo} alt="Logo RegistrAgil" className="Logo" />
          </Link>
        </li>
        <li className="Bloque Centro">R E C E P C I O N I S T A</li>
        <li className="Bloque Derecha">
          <button
            onClick={() => {localStorage.removeItem("correo"); localStorage.removeItem("permiso"); navigate("/Login")}}
            className="pt-2 pb-2 ps-1 pe-1 cerrar-sesion"
          >
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </>
  );
}
