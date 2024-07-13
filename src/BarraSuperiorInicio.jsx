import LogoInicio from './imgs/RAC_logo.jpg'
import { Link } from 'react-router-dom'
import "./CSS/BarraSuperiorInicio.css";

export function BarraSuperiorInicio() {
    return (
        <>
            <ul className='BarraSuperiorInicio'>
                <li className='BloqueInicio IzquierdaInicio'><Link><img src={LogoInicio} alt='Logo RegistrAgil' className='LogoInicio' /></Link></li>
                <li className='BloqueInicio CentroInicio'>R E G I S T R Á G I L</li>
                <li className='BloqueInicio DerechaInicio'><Link to="/LogIn" className='p-3'>Iniciar Sesión</Link></li>
            </ul>
        </>
    );
}