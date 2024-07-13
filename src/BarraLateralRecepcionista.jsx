import { NavLink } from "react-router-dom";
import "./CSS/BarraLateral.css";
import BarraLogo from "./imgs/RA_logo.png";
import Inicio from "./imgs/inicio.png";
import Perfil from "./imgs/perfil.png";
import VisualizarDatos from "./imgs/crear_junta.png";
import QR from "./imgs/qr.png";
import ConsultarJuntas from "./imgs/ges_juntas.png";

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
          <NavLink to="/Recepcionista/Bienvenida" className={({ isActive }) => (isActive ? "active" : "")}>
            <img src={Inicio} alt="Inicio Icono" className="Iconos" id="IconoInicio"/>
            <span>Inicio</span>
          </NavLink>
        </li>
        <li className="botonBarra">
          <NavLink to="/Recepcionista/Perfil" className={({ isActive }) => (isActive ? "active" : "")}>
            <img src={Perfil} alt="Mi Perfil Icono" className="Iconos" />
            <span>Mi Perfil</span>
          </NavLink>
        </li>
        <li className="botonBarra">
          <NavLink to="/Recepcionista/QR" className={({ isActive }) => (isActive ? "active" : "")}>
            <img src={QR} alt="QR Icono" className="Iconos"/>
            <span>Escanear QR</span>
          </NavLink>
        </li>
        <li className="botonBarra">
          <NavLink to="/Recepcionista/ConsultarJuntas" className={({ isActive }) => (isActive ? "active" : "")}>
            <img src={ConsultarJuntas} alt="Consultar Juntas Icono" className="Iconos"/>
            <span>Consultar Juntas</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}