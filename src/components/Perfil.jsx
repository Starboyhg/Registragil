import React, { useEffect, useState } from "react";
import {  Container,  Card,  Form,  Row,  Col,  Image,  FloatingLabel } from "react-bootstrap";
import PerfilD from "../imgs/user.png";
import "../CSS/Administrador.css";

function UserProfile() {
  const [user, setUser] = useState({
    nombre: "",
    apaterno: "",
    amaterno: "",
    correo: "",
    fotografia: "",
  });

  const Mostrarperfil = async () => {
    console.log("Cargando perfil");
    console.log("correo", window.localStorage.getItem("correo"));
    const datos = { correo: window.localStorage.getItem("correo") };
    try {
      const respuesta = await fetch(
        "http://localhost/RegistrAgil/Perfil/perfil.php",
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
      if (json.existe === false) {
        console.log("No existe el usuario");
      } else {
        setUser({
          nombre: json.nombre,
          apaterno: json.apellidop,
          amaterno: json.apellidom,
          correo: json.correo,
          fotografia: json.foto,
        });
      }
    } catch (error) {
      console.log("Error al cargar perfil", error);
    }
  };

  useEffect(() => {
    Mostrarperfil();
  }, []);

  return (
    <>
      <Container
        fluid
        id="perfil"
        className="mainContainer d-flex justify-content-center mt-2"
      >
        <Row className="d-flex justify-content-center" style={{ width: "80%" }}>
          <div>
            <Card.Title className="mb-4 titulo">Detalles del Perfil</Card.Title>
            <Card className="card-datos d-flex justify-content-center">
              <Card.Body>
                <Form>
                  <Row>
                    <Col xs={12} lg={4} className="d-flex align-items-center justify-content-center">
                      <Container className="text-center">
                        <Image
                          src={user.fotografia ? `data:image/jpeg;base64,${user.fotografia}` : PerfilD}
                          alt="foto de perfil"
                          className="rounded-circle Usuario"
                        />
                      </Container>
                    </Col>
                    <Col xs={12} lg={8}>
                      <Row>
                        <Form.Group>
                          <FloatingLabel
                            controlId="floatingInput"
                            label="Nombre(s)"
                            className="mt-3 mb-3"
                          >
                            <Form.Control
                              type="text"
                              name="nombre"
                              className="input card-input"
                              value={user.nombre}
                              readOnly
                            />
                          </FloatingLabel>
                        </Form.Group>
                      </Row>
                      <Row>
                        <Form.Group>
                          <FloatingLabel
                            controlId="floatingInput"
                            label="Apellido Paterno"
                            className="mb-3"
                          >
                            <Form.Control
                              type="text"
                              name="apaterno"
                              className="input card-input"
                              value={user.apaterno}
                              readOnly
                            />
                          </FloatingLabel>
                        </Form.Group>
                        <Form.Group>
                          <FloatingLabel
                            controlId="floatingInput"
                            label="Apellido Materno"
                            className="mb-3"
                          >
                            <Form.Control
                              type="text"
                              name="amaterno"
                              className="input card-input"
                              value={user.amaterno}
                              readOnly
                            />
                          </FloatingLabel>
                        </Form.Group>
                      </Row>
                      <Row>
                        <Form.Group>
                          <FloatingLabel
                            controlId="floatingInput"
                            label="Correo Electrónico"
                            className="mb-3"
                          >
                            <Form.Control
                              type="text"
                              name="correo"
                              className="input card-input"
                              value={user.correo}
                              readOnly
                            />
                          </FloatingLabel>
                        </Form.Group>
                      </Row>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
}

export default UserProfile;
