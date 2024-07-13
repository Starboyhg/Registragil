import { NavLink } from "react-router-dom";
import "./CSS/BarraLateral.css";
import BarraLogo from "./imgs/RA_logo.png";
import Inicio from "./imgs/inicio.png";
import Perfil from "./imgs/perfil.png";
import Calendario from "./imgs/calendario.png";
import CrearJunta from "./imgs/crear_junta.png";
import GestionarJuntas from "./imgs/ges_juntas.png";

export function BarraLateral() {
  return (
    <div className="navContainer">
      <ul className="sidenav">
        {/* <li className="BarraLogo">
          <img src={BarraLogo} alt="RegistrAgil" />
        </li> */}
        <li className="encabezados">
          <strong>Navegación Principal</strong>
        </li>
        <li className="botonBarra">
          <NavLink to="/Anfitrion/Bienvenida" className={({ isActive }) => (isActive ? "active" : "")}>
            <img src={Inicio} alt="Inicio Icono" className="Iconos" id="IconoInicio"/>
            <span>Inicio</span>
          </NavLink>
        </li>
        <li className="botonBarra">
          <NavLink to="/Anfitrion/Perfil" className={({ isActive }) => (isActive ? "active" : "")}>
            <img src={Perfil} alt="Mi Perfil Icono" className="Iconos" />
            <span>Mi Perfil</span>
          </NavLink>
        </li>
        <li className="botonBarra">
          <NavLink to="/Anfitrion/CalendarioJuntas" className={({ isActive }) => (isActive ? "active" : "")}>
            <img src={Calendario} alt="Calendario Icono" className="Iconos" />
            <span>Calendario de Juntas</span>
          </NavLink>
        </li>
        <li className="botonBarra">
          <NavLink to="/Anfitrion/CrearJunta" className={({ isActive }) => (isActive ? "active" : "")}>
            <img src={CrearJunta} alt="Crear Junta Icono" className="Iconos"/>
            <span>Crear Junta</span>
          </NavLink>
        </li>
        <li className="encabezados">
          <strong>Administración</strong>
        </li>
        <li className="botonBarra">
          <NavLink to="/Anfitrion/GestionarJuntas" className={({ isActive }) => (isActive ? "active" : "")}>
            <img src={GestionarJuntas} alt="Gestionar Juntas Icono" className="Iconos"/>
            <span>Gestionar Juntas</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}