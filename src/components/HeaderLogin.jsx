import { Link } from "react-router-dom";
import LogoHL from "../imgs/RA_logo.png";
import "../CSS/BarraSuperiorLogin.css";
import * as Icon from "react-bootstrap-icons";

function BarraSuperiorLogin() {
  return (
    <>
      <ul className='BarraSuperiorHL'>
        <li className='BloqueHL IzquierdaHL'><Link to={"/Inicio"}><Icon.ArrowLeft color="white" size={25}/></Link></li>
        <li className='BloqueHL CentroHL'><img src={LogoHL} alt='Logo RegistrAgil' className='LogoHL'/></li>
        <li className='BloqueHL DerechaHL'></li>
      </ul>
    </>
  );
}

export default BarraSuperiorLogin;