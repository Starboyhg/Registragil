import { NavLink } from "react-router-dom";
import "./CSS/BarraLateral.css";
import BarraLogo from "./imgs/RA_logo.png";
import Inicio from "./imgs/inicio.png";
import Perfil from "./imgs/perfil.png";
import Calendario from "./imgs/calendario.png";
import EntradaSalida from "./imgs/entradas_salidas.png";
import RegisEmpleados from "./imgs/reg_empleado.png";
import Juntas from "./imgs/ges_juntas.png";
import Invitados from "./imgs/ges_invitado.png";
import Empleados from "./imgs/ges_empleados.png";

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
          <NavLink to="/Administrador/Bienvenida" className={({ isActive }) => (isActive ? "active" : "")}>
            <img src={Inicio} alt="Inicio Icono" className="Iconos" id="IconoInicio" />
            <span>Inicio</span>
          </NavLink>
        </li>
        <li className="botonBarra">
          <NavLink to="/Administrador/Perfil" className={({ isActive }) => (isActive ? "active" : "")}>
            <img src={Perfil} alt="Mi Perfil Icono" className="Iconos" />
            <span>Mi Perfil</span>
          </NavLink>
        </li>
        <li className="botonBarra">
          <NavLink to="/Administrador/CalendarioJuntas" className={({ isActive }) => (isActive ? "active" : "")}>
            <img src={Calendario} alt="Calendario Icono" className="Iconos" />
            <span>Calendario de Juntas</span>
          </NavLink>
        </li>
        <li className="botonBarra">
          <NavLink to="/Administrador/VisualizarES" className={({ isActive }) => (isActive ? "active" : "")}>
            <img src={EntradaSalida} alt="Entrada/Salida Icono" className="Iconos" />
            <span>Visualizar Entradas/Salidas</span>
          </NavLink>
        </li>
        <li className="encabezados">
          <strong>Administración de Empleado</strong>
        </li>
        <li className="botonBarra">
          <NavLink to="/Administrador/RegistrarEmpleado" className={({ isActive }) => (isActive ? "active" : "")}>
            <img src={RegisEmpleados} alt="Registrar Icono" className="Iconos" />
            <span>Registrar Empleado</span>
          </NavLink>
        </li>
        <li className="botonBarra">
          <NavLink to="/Administrador/GestionarJuntas" className={({ isActive }) => (isActive ? "active" : "")}>
            <img src={Juntas} alt="Juntas Icono" className="Iconos" />
            <span>Gestionar Juntas</span>
          </NavLink>
        </li>
        {/*<li className="botonBarra">
          <NavLink to="/Administrador/GestionarInvitados" className={({ isActive }) => (isActive ? "active" : "")}>
            <img src={Invitados} alt="Gestionar Invitados Icono" className="Iconos" />
            <span>Gestionar Invitados</span>
          </NavLink>
        </li>*/}
        <li className="botonBarra">
          <NavLink to="/Administrador/GestionarEmpleados" className={({ isActive }) => (isActive ? "active" : "")}>
            <img src={Empleados} alt="Gestionar Empleados Icono" className="Iconos" />
            <span>Gestionar Empleados</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}