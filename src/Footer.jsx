import { Container, Row, Col } from "react-bootstrap";
import "./CSS/Footer.css";

export function FooterPG() {
  return (
      <Container fluid className='PiePag'>
        <Row className="p-3">
          <Col><p>Acerca de</p></Col>
          <Col><p>Soporte</p></Col>
          <Col><p>Legal</p></Col>
          <Col><p>Seguridad</p></Col>
          <Col><p>Redes Sociales</p></Col>
        </Row>
        <Row className="pb-2">
            <p>&copy; 2024 RegistÁgil. Todos los derechos reservados.</p>
        </Row>
      </Container>

  );
}