import LogoInv from "./imgs/RA_logo.png";
import { Link, useNavigate  } from "react-router-dom";
import "./CSS/BarraSuperiorInvitado.css";

export function BarraSuperior() {
  const navigate = useNavigate();
  return (
    <ul className="BarraSuperiorInv">
      <li className="BloqueInv IzquierdaInv">
        <Link to={"/Invitado"}>
          <img src={LogoInv} alt="Logo RegistrAgil" className="LogoInv" />
        </Link>
      </li>
      <li className="BloqueInv CentroInv">I N V I T A D O</li>
      <li className="BloqueInv DerechaInv">
        <button
          onClick={() =>{localStorage.removeItem("correo"); localStorage.removeItem("permiso"); navigate("/Login")}}
          className="pt-2 pb-2 ps-1 pe-1 cerrar-sesion"
        >
          Cerrar Sesión
        </button>
      </li>
    </ul>
  );
}