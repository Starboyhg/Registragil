import { Link } from "react-router-dom";
import LogoHL from "../imgs/RA_logo.png";
import "../CSS/BarraSuperiorForm.css";
import * as Icon from "react-bootstrap-icons";

function BarraSuperiorForm() {
  return (
    <>
      <ul className='BarraSuperiorForm '>
        <li className='BloqueForm  IzquierdaForm '></li>
        <li className='BloqueForm  CentroForm '><img src={LogoHL} alt='Logo RegistrAgil' className='LogoForm '/></li>
        <li className='BloqueForm  DerechaForm '></li>
      </ul>
    </>
  );
}

export default BarraSuperiorForm;