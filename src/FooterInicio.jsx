import { Container, Col, Row } from "react-bootstrap"
import "./CSS/FooterInicio.css"

export function FooterPI() {
    return (
        <footer>
            <Container fluid id="footerInicio">
                <Row className="mt-4">
                    <Col>
                        <ul>
                            <li><h6>Acerca de</h6></li>
                            <li>The Software Legends</li>
                            <li>Impacto social</li>
                        </ul>
                    </Col>
                    <Col>
                        <ul>
                            <li><h6>Soporte</h6></li>
                            <li>Chat en Linea</li>
                        </ul>
                    </Col>
                    <Col>
                        <ul>
                            <li><h6>Legal</h6></li>
                            <li>Aviso Legal</li>
                            <li>Politicas de Privacidad</li>
                            <li>Aviso de Privacidad</li>
                        </ul>
                    </Col>
                    <Col>
                        <ul>
                            <li><h6>Seguridad</h6></li>

                        </ul>
                    </Col>
                    <Col>
                        <ul>
                            <li><h6>Redes Sociales</h6></li>
                            <li>Facebook</li>
                            <li>X</li>
                            <li>Instagram</li>
                        </ul>
                    </Col>
                </Row>
                <Row className="mt-2 mb-2">
                    <p>&copy; 2024 RegistÁgil. Todos los derechos reservados.</p>
                </Row>
            </Container>
        </footer>
    )
}