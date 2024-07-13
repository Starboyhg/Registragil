import { Col, Row, Container, Button } from "react-bootstrap";
import { BarraSuperiorInicio } from "./BarraSuperiorInicio";
import { FooterPI } from "./FooterInicio";
import Edificio from "./imgs/edificio.jpg";
import "./CSS/PagInicio.css";
import { Link } from "react-router-dom";

export default function PagIn() {
  return (
    <>
      <BarraSuperiorInicio />
      <Container fluid id="inicio">
        <Row className="h-100 align-items-center">
          <Col xs={12} md={4} className="d-flex justify-content-center">
            <div className="img-container">
              <img src={Edificio} alt="Edificio" className="img-edificio"/>
            </div>
          </Col>
          <Col xs={12} md={8} className="text-end">
            <div>
              <h1 className="mb-4 mt-md-0 mt-5">La gestión más rápida contigo, RegistrÁgil</h1>
              <p className="ps-5">
                RegistrÁgil es un Sistema Digital de Administración y Logística de
                Información que se encarga de gestionar eficientemente todos los
                aspectos relacionados con la organización y logística de una
                empresa, desde las gestión de reuniones hasta el control de acceso
                de invitados externos a la empresa. RegistrÁgil ofrece una
                solución integral para mejorar la eficiencia y seguridad en el
                entorno laboral.
              </p>
              <p>
                Para acceder al sistema, inicie sesión.
              </p>
              <Row className="justify-content-end" as={Col} xs="auto">
                <Button className="mt-3 boton">
                  <Link to={"/LogIn"}>Iniciar Sesión</Link>
                </Button>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
      <FooterPI />
    </>
  );
}