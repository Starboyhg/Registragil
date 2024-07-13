import React, { useEffect, useState } from "react";
import { Card, Form, Row, Col, Button, Container } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import "./CSS/JuntasPendientes.css";
import iconoQR from "./imgs/qr copy.png";

export function JuntasPendientes() {
  const [juntas, setJuntas] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();

  const obtenerJuntas = async () => {
    console.log("Cargando perfil");
    console.log("correo", window.localStorage.getItem("correo"));
    const correo = window.localStorage.getItem("correo");
    const datos = { correo: correo };

    try {
      const respuesta = await fetch(
        "http://localhost/RegistrAgil/Invitado/VerJuntasInvitado.php",
        {
          method: "POST",
          body: JSON.stringify(datos),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await respuesta.json();
      console.log("respuesta obtenida: ", json);
      if (json.success === false) {
        console.log("Error del servidor. No se pudo obtener las juntas.");
      } else {
        setJuntas(json);
      }
    } catch (error) {
      console.log("Error al obtener las juntas:", error);
    }
  };

  useEffect(() => {
    obtenerJuntas();
  }, []);

  const handleConsultarQR = (junta) => {
    navigate("/Invitado/DescargarQR", { state: junta });
  };

  const handlePreviousDay = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
  };

  const handleNextDay = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const filteredJuntas = juntas.filter((junta) => {
    return junta.Fecha === formatDate(currentDate);
  }).sort((a, b) => {
    const horarioA = a.Horario.split("-")[0];
    const horarioB = b.Horario.split("-")[0];
    const dateA = new Date(`${a.Fecha}T${horarioA}`);
    const dateB = new Date(`${b.Fecha}T${horarioB}`);
    return dateA - dateB;
  });

  const isPastDate = (date) => {
    const today = new Date();
    // console.log("Año actual", today.getFullYear(), "Mes actual", today.getMonth()+1, "Día actual", today.getDate());
    // console.log("Fecha de la junta a comparar", new Date(date).getFullYear(), new Date(date).getMonth()+1, new Date(date).getDate()+1);
    return new Date(new Date(date).getFullYear(), new Date(date).getMonth()+1, new Date(date).getDate()+1) < new Date(today.getFullYear(), today.getMonth()+1, today.getDate());
  };

  return (
    <>
      <h2 className="title">Juntas Agendadas</h2>
      <Container fluid className="main-container">
        <div className="date-navigation">
          <Button className="boton" onClick={handlePreviousDay}><FaChevronLeft size={25} /></Button>
          <span style={{fontWeight: '600', fontSize: '25px', fontFamily: 'Livvic'}}>{formatDate(currentDate)}</span>
          <Button className="boton" onClick={handleNextDay}><FaChevronRight size={25} /></Button>
        </div>
        <div className="juntasPendientesContainer">
          {filteredJuntas.length === 0 ? (
            <Card className="mb-3 junta-card">
              <Card.Body className="body_card">
                <Card.Text className="mt-2">
                  No tienes juntas pendientes para este día.
                </Card.Text>
              </Card.Body>
            </Card>
          ) : (
            filteredJuntas.map((junta, index) => (
              <Card key={index} className="mb-3 junta-card">
                <Card.Body className="body_card">
                  <Row>
                    <Col xs={12} md={9}>
                      <Form>
                        <Form.Group as={Row} className="mb-0">
                          <Form.Label column sm={12}>
                            Anfitrión
                            <Form.Control
                              type="text"
                              className="card-inputJP"
                              readOnly
                              value={junta.Responsable}
                            />
                          </Form.Label>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-0">
                          <Form.Label column sm={12}>
                            Asunto de la Junta
                            <Form.Control
                              type="text"
                              className="card-inputJP"
                              readOnly
                              value={junta.Asunto || ""}
                            />
                          </Form.Label>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-0">
                          <Form.Label column sm={4}>
                            Fecha
                            <Form.Control
                              type="text"
                              className="card-inputJP"
                              readOnly
                              value={junta.Fecha}
                            />
                          </Form.Label>
                          <Form.Label column sm={4}>
                            Hora de Inicio
                            <Form.Control
                              type="text"
                              className="card-inputJP"
                              readOnly
                              value={junta.Horario.split("-")[0]}
                            />
                          </Form.Label>
                          <Form.Label column sm={4}>
                            Hora de Fin
                            <Form.Control
                              type="text"
                              className="card-inputJP"
                              readOnly
                              value={junta.Horario.split("-")[1]}
                            />
                          </Form.Label>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-0">
                          <Form.Label column sm={12}>
                            Sala
                            <Form.Control
                              type="text"
                              className="card-inputJP"
                              readOnly
                              value={junta.Sala}
                            />
                          </Form.Label>
                        </Form.Group>
                      </Form>
                    </Col>
                    <Col
                      xs={12}
                      md={3}
                      className="text-center d-flex justify-content-center align-items-center flex-column"
                    >
                      <Form.Label column sm={10}>
                        {isPastDate(junta.Fecha) ? (
                          <Button disabled className="btn btn-secondary qr-button">
                            El Código Expiró
                          </Button>
                        ) : (
                          <>
                            Consultar QR
                            <Button
                              onClick={() => handleConsultarQR(junta)}
                              className="btn btn-primary qr-button"
                            >
                              <img
                                src={iconoQR}
                                alt="Código QR"
                                className="qr-image"
                              />
                            </Button>
                          </>
                        )}
                      </Form.Label>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      </Container>
    </>
  );
}
