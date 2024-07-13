import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { BarraSuperior } from "./BarraSuperiorInvitado";
import { PagPrinusers } from "./PagPrincipalusuarios";
import { JuntasPendientes } from "./JuntasPendientes";
import { FooterPG } from "./Footer";
// import "./Layout.css";

export default function Invitado() {

  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem("correo")) {
      switch(parseInt(localStorage.getItem("permiso"))) {
        case 1:
          navigate('/Administrador/Bienvenida');
          break;
        case 3:
          navigate('/Recepcionista/Bienvenida');
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
      <header> <BarraSuperior /> </header>
      <Container fluid className="main-container">
        <Row>
          <Col md={6}>
            <JuntasPendientes />
          </Col>
          <Col md={1} className="linea-divisoria"></Col>
          <Col md={4}>
            <PagPrinusers nombre="Nombre del Usuario" />
          </Col>
        </Row>
      </Container>
      <footer> <FooterPG /> </footer>
    </>
  );
}
