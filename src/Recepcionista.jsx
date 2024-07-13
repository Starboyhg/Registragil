import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { BarraLateral } from "./BarraLateralRecepcionista";
import { BarraSuperior } from "./BarraSuperiorRecepcionista";
import { FooterPG } from "./Footer";
import "./Layout.css";

export default function Recepcionista() {

  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem("correo")) {
      switch(parseInt(localStorage.getItem("permiso"))) {
        case 1:
          navigate('/Administrados/Bienvenida');
          break;
        case 2:
          navigate('/Invitado/Bienvenida');
          break;
        case 4:
          navigate('/Anfitrion/Bienvenida');
          break;        
      }
    }else{
      //Si se pude cambiar el alert por un modal o nose
      // alert('No has iniciado sesion');
      navigate('/LogIn');
    }
  },[]);

  return (
    <>
      <header><BarraSuperior/></header>
      <Container fluid style={{ backgroundColor: '#F0F8FF', marginTop: '50px' }}>
      <Row>
       <Col style={{padding: 0}} xs="3"><BarraLateral/></Col>
       <Col xs="9" className="Recepcionista"><Outlet/></Col>
      </Row>
      </Container>
      <footer><FooterPG/></footer>
    </>
  );
}