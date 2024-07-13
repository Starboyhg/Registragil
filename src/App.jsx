import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PagInicio from "./PagInicio";
import LogIn from "./components/Login";
import RecoverPassword from "./components/RecoverPassword";
import ResetPassword from "./components/ResetPassword";
import ChangePassword from "./components/ChangePassword";
import GestionarJuntas from "./components/GestionarJuntas";
import Administrador from "./Administrador";
import Anfitrion from "./Anfitrion";
import Invitado from "./Invitado";
import Recepcionista from "./Recepcionista";
import QrScanner from "qr-scanner";
import QRgenerator from "./QrScanner";
import QRscanner from "./QrScanner";
//import { PGRecepcionista } from "./PGenRecepcionista";
import { PagPrinusers } from "./PagPrincipalusuarios";
import UserProfile from "./components/Perfil";
import Calendar from "./components/Calendar";
import { ViEntrSal } from "./VisualizarEntrSal";
import RegEmp from "./components/RegistrarEmp";
import PantGesInvi from "./PantGestInv";
import PantGesEmp from "./PantGesEmp";
import CrearJunta from "./components/CrearJunta";
import VisualizarDatos from "./components/VisualizarDatos";
import FormInv from "./components/FormInv";
import FormAcom from "./components/FormAcom";
import DescargarQR from "./components/DescargarQR";
import CalendarRec from "./components/ConsultarJuntas";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Inicio" exact element={<PagInicio />} />
        <Route path="/LogIn" element={<LogIn />}></Route>
        <Route path="/RecoverPassword" element={<RecoverPassword />}></Route>
        <Route path="/ResetPassword" element={<ResetPassword />}></Route>
        <Route path="/ChangePassword" element={<ChangePassword />}></Route>
        <Route path="/Administrador" exact element={<Administrador />}>
          <Route path="Bienvenida" element={<PagPrinusers />} />
          <Route path="Perfil" element={<UserProfile />} />
          <Route path="CalendarioJuntas" element={<Calendar />} />
          <Route path="VisualizarES" element={<ViEntrSal />} />
          <Route path="RegistrarEmpleado" element={<RegEmp />} />
          <Route path="GestionarJuntas" element={<GestionarJuntas />} />
          <Route path="GestionarInvitados" element={<PantGesInvi />} />
          <Route path="GestionarEmpleados" element={<PantGesEmp />} />
        </Route>
        <Route path="/Anfitrion" exact element={<Anfitrion />}>
          <Route path="Bienvenida" element={<PagPrinusers />} />
          <Route path="Perfil" element={<UserProfile />} />
          <Route path="CalendarioJuntas" element={<Calendar />} />
          <Route path="CrearJunta" element={<CrearJunta />} />
          <Route path="GestionarJuntas" element={<GestionarJuntas />} />
        </Route>
        <Route path="/Invitado" exact element={<Invitado />}>
          <Route path="Bienvenida" element={<PagPrinusers />} />
          {/* <Route path="DescargarQR" element={<DescargarQR />} /> */}
        </Route>
        <Route path="/Invitado/DescargarQR" element={<DescargarQR />} />
        <Route path="/Recepcionista" exact element={<Recepcionista />}>
          <Route path="Bienvenida" element={<PagPrinusers />} />
          <Route path="Perfil" element={<UserProfile />} />
          <Route path="QR" element={<VisualizarDatos />} />
          <Route path="ConsultarJuntas" element={<CalendarRec />}/>
        </Route>
        <Route path="/FormularioInvitado" exact element={<FormInv />} />
        <Route path="/FormularioAcompañante" exact element={<FormAcom />} />
      </Routes>
    </Router>
  );
}

export default App;
