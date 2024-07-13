import { Container, Card, CardBody, Row, Col, Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useState } from "react";
import HeaderLogin from "./HeaderLogin";
import { useNavigate } from "react-router-dom";
import { FooterPG } from "../Footer";
import "../CSS/Administrador.css";

function RecoverPassword() {
  const [email, setEmail] = useState("");
  const [emailValido, setEmailValido] = useState(true);
  const navigate = useNavigate();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [tituloModal, settituloModal] = useState("");

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailValido(value.trim() !== "");
  };

  const handleCancelar = () => {
    navigate("/LogIn");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailValido) {
      const options = {
        method: "PATCH",
        mode: "cors",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo: email }),
        referrerPolicy: "no-referrer",
      };

      fetch(
        "http://localhost/RegistrAgil/recuperarContra/recuperar.php",
        options
      )
        .then((response) => response.json()).then()
        .then((data) => {
          if (data.success) {
            // alert("Se envio a su correo el link");
            //Aqui se habilitaria un modal o ventana emergente para avisarle que se envio a su correo el siguiente paso
            settituloModal("Correo Enviado");
            setErrorMessage("Se ha enviado un correo a la dirección proporcionada con las instrucciones para recuperar tu contraseña.");
            setShowErrorModal(true);

            //Al aceptar o se muestra otra pantalla o se direcciona al inicio
            
          } else {
            //Aqui iria que no se pudo que lo intente mas tarde, el mensaje especifico de error se encuentra en la respuesta como: data.error
            settituloModal("Error al Enviar Correo");
            setErrorMessage(data.error);
            setShowErrorModal(true);
            // alert(data.error);
          }
        });
    }
  };

  return (
    <>
      <HeaderLogin />
      <Container fluid className="main-container d-flex justify-content-center mt-6 mb-6">
          <Row className="d-flex justify-content-center">
            <Col xs={12}>
              <Card.Title className="text-center mb-5 titulo fw-bold mt-2">Recuperación de Contraseña</Card.Title>
              <Card className=" card-datos d-flex justify-content-center">
                <CardBody>
                  <p className="mb-1" style={{ textAlign: "center" }}>
                    Si olvidaste tu contraseña puedes recuperarla ingresando tu
                    correo electrónico aquí.
                    <br />
                    Se te enviará un correo donde podrás cambiar tu contraseña.
                  </p>
                  <br />
                  <Form method="post" onSubmit={handleSubmit}>
                    <Row>
                      <Form.Group as={Col}>
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Correo Electrónico"
                          className="mb-3"
                        >
                          <Form.Control
                            type="email"
                            placeholder="Introduce tu correo electrónico"
                            value={email}
                            onChange={handleEmailChange}
                            className="card-input"
                            isInvalid={!emailValido}
                          />
                          <Form.Control.Feedback type="invalid">
                            {!emailValido &&
                              "Por favor ingresa un correo electrónico válido"}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Form.Group>
                    </Row>
                    <br />
                    <Row
                      className="justify-content-center"
                      style={{ textAlign: "center" }}
                    >
                      <Form.Group as={Col} xs={6}>
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={handleCancelar}
                          className="boton"
                        >
                          Cancelar
                        </Button>
                      </Form.Group>
                      <Form.Group as={Col} xs={6}>
                        <Button
                          className="boton"
                          variant="primary"
                          type="submit"
                          disabled={!emailValido || email === ""}
                        >
                          Aceptar
                        </Button>
                      </Form.Group>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
      </Container>
      <FooterPG />

      {/* Modal de error */}
      <Modal show={showErrorModal} className="custom-modal" onHide={() => {setShowErrorModal(false); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>{tituloModal}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="paddingBody">
          <p className="parrafoModal">{errorMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="boton" onClick={() => {setShowErrorModal(false); navigate("/Inicio");}}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RecoverPassword;
