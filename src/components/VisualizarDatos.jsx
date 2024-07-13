import React, { useState } from "react";
import { Container, Card, Form, CardBody, Row, Col, Image, Button, FloatingLabel, Modal } from "react-bootstrap";
import QRscanner from "../QrScanner";
import PerfilD from "../imgs/user.png";
import "../CSS/Administrador.css";
import "../CSS/PagPrincipalusuarios.css";
function VisualizarDatos() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const [id_qr, SetIDQR] = useState(1);
  const initialValues = {
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    telefono: "",
    empresa: "",
    documento: "",
    anfitrion: "",
    asunto: "",
    sala: "",
    fecha: "",
    horai: "",
    horaf: "",
    dispositivos: [],
    amodelo: "",
    placa: "",
    color: "",
    // id_Codigo: "", // Supongamos que este es el id_Codigo
  };
  const [datos, setDatos] = useState(initialValues);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [tituloModal, settituloModal] = useState("");

  const registrarHora = async (tipo) => {
    const url =
      tipo === "entrada"
        ? "http://localhost/RegistrAgil/Recepcionista/RegistrarEntradas.php"
        : "http://localhost/RegistrAgil/Recepcionista/RegistrarSalidas.php";

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const hora = `${hours}:${minutes}:${seconds}`;

    const id_Codigo = id_qr;

    try {
      console.log(id_qr);
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          hora: hora,
          id_Codigo: id_qr,
        }),
      });
      if (response.ok) {
        let res = await response.json();
        console.log(res);
        console.log(hora);
        if(res.success == true){
          console.log(`Hora de ${tipo} registrada: ${hora} y : ${id_Codigo}`);
          setModalTitle("Datos Registrados");
          setModalMessage(`La hora de ${tipo} a las ${hora} se ha registrado con éxito.`);
          setShowSuccessModal(true);
        }else{
          setModalTitle("Datos No Registrados");
          setModalMessage("Ocurrió un error al enviar los datos: " + res.message);
          setShowSuccessModal(true);
        }
        setDatos(initialValues);
        SetIDQR(1);
        // id_Codigo = 0;
      } else {
        const result = await response.json();
        console.log(`Error registrando la ${tipo}: ${result.message}`);
        setModalTitle("Datos No Registrados");
        setModalMessage("Ocurrió un error al enviar los datos.");
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error(`Error registrando la ${tipo}:`, error);
      setModalTitle("Datos No Registrados");
      setModalMessage("Ocurrió un error al enviar los datos.");
      setShowSuccessModal(true);
    }
  };

  const handleDataReceived = (data) => {
    if (data.error) {
      console.error(data.error);
      return;
    }
    setDatos({
      nombre: data.invitado?.nombre || "",
      apellido_paterno: data.invitado?.apellido_paterno || "",
      apellido_materno: data.invitado?.apellido_materno || "",
      telefono: data.invitado?.telefono || "",
      empresa: data.invitado?.empresa || "",
      documento: data.invitado?.Identificacion || '', //enviar documento desde back
      anfitrion: data.anfitrion ? `${data.anfitrion.nombre} ${data.anfitrion.apellido_paterno} ${data.anfitrion.apellido_materno}`
        : "",
      asunto: data.junta?.concepto || '', //enviar asunto desde back
      sala: data.junta?.sala || "",
      fecha: data.junta?.fecha || "",
      horai: data.junta?.horaInicio || "",
      horaf: data.junta?.horaFin || "", //enviar hora fin desde back
      dispositivos: data.dispositivos || [], //Enviar Dispositivos desde back
      amodelo: data.auto?.modelo || "",
      placa: data.auto?.placa || "",
      color: data.auto?.color || "",
      foto: data.invitado?.foto || "",
    });
  };

  return (
    <>
      <Container fluid id="FormInv" className="mainContainer d-flex justify-content-center">
        <Row className="d-flex justify-content-center" style={{ width:'95%' }}>
          <div>
            <Row>
              <Col xs={12} lg={4} className="mb-5">
                <div>
                  <div style={{ justifyContent: "center", display: "flex" }}>
                    <QRscanner setQR={SetIDQR} onDataReceived={handleDataReceived} />
                  </div>
                  <div className="w-100 gap-4 d-flex justify-content-between mt-3">
                    <Button
                      className="boton ms4"
                      onClick={() => registrarHora("entrada")}
                    >
                      Registrar Entrada
                    </Button>
                    <Button
                      className="boton"
                      onClick={() => registrarHora("salida")}
                    >
                      Registrar Salida
                    </Button>
                  </div>
                </div>
              </Col>
              <Col xs={12} lg={8} style={{ height: '500px', overflowY: 'auto' }}>
                <Row className="d-flex justify-content-center">
                  <Card className="card-datos">
                    <CardBody>
                      <Form>
                        <Card.Title className="titulo mb-3">
                          Datos Personales
                        </Card.Title>
                        <Row>
                          <Col xs={12} lg={4} className="d-flex align-items-center justify-content-center">
                            <Container className="text-center mb-3">
                              <Image
                                src={datos.foto ? `data:image/jpeg;base64,${datos.foto}` : PerfilD}
                                alt="Fotografía del Empleado"
                                className="rounded-circle Usuario card-foto" />
                            </Container>
                          </Col>
                          <Col xs={12} lg={8}>
                            <Row>
                              <Form.Group>
                                <FloatingLabel
                                  controlId="floatingInput"
                                  label="Nombre(s)"
                                  className="mb-3"
                                >
                                  <Form.Control
                                    type="text"
                                    name="nombre"
                                    placeholder=""
                                    className="input card-input"
                                    value={datos.nombre}
                                    readOnly
                                  />
                                </FloatingLabel>
                              </Form.Group>
                            </Row>
                            <Row>
                              <Col xs={12} md={6}>
                                <Form.Group>
                                  <FloatingLabel
                                    controlId="floatingInput"
                                    label="Apellido Paterno"
                                    className="mb-3"
                                  >
                                    <Form.Control
                                      type="text"
                                      name="apaterno"
                                      placeholder=""
                                      className="input card-input"
                                      value={datos.apellido_paterno}
                                      readOnly
                                    />
                                  </FloatingLabel>
                                </Form.Group>
                              </Col>
                              <Col xs={12} md={6}>
                                <Form.Group as={Col}>
                                  <FloatingLabel
                                    controlId="floatingInput"
                                    label="Apellido Materno"
                                    className="mb-3"
                                  >
                                    <Form.Control
                                      type="text"
                                      name="amaterno"
                                      placeholder=""
                                      className="input card-input"
                                      value={datos.apellido_materno}
                                      readOnly
                                    />
                                  </FloatingLabel>
                                </Form.Group>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12} md={6}>
                                <Form.Group>
                                  <FloatingLabel
                                    controlId="floatingInput"
                                    label="Teléfono"
                                    className="mb-3"
                                  >
                                    <Form.Control
                                      type="text"
                                      name="telefono"
                                      placeholder=""
                                      className="input card-input"
                                      value={datos.telefono}
                                      readOnly
                                    />
                                  </FloatingLabel>
                                </Form.Group>
                              </Col>
                              <Col xs={12} md={6}>
                                <Form.Group>
                                  <FloatingLabel
                                    controlId="floatingInput"
                                    label="Empresa"
                                    className="mb-3"
                                  >
                                    <Form.Control
                                      type="text"
                                      name="empresa"
                                      placeholder=""
                                      className="input card-input"
                                      value={datos.empresa}
                                      readOnly
                                    />
                                  </FloatingLabel>
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                          <Form.Group>
                            <FloatingLabel
                              controlId="floatingInput"
                              label="Documento"
                              className="mb-3"
                            >
                              <Form.Control
                                type="text"
                                name="documento"
                                placeholder=""
                                className="input card-input"
                                value={datos.documento}
                                readOnly
                              />
                            </FloatingLabel>
                          </Form.Group>
                        </Row>
                        <hr className="mt-0" />
                        <Row>
                          <Col xs={12} md={12}>
                            <Card.Title className="titulo mb-2">
                              Datos de la Junta
                            </Card.Title>
                            <Row>
                              <Col xs={12} md={12}>
                                <Form.Group>
                                  <FloatingLabel
                                    controlId="floatingInput"
                                    label="Fecha"
                                    className="mb-3"
                                  >
                                    <Form.Control
                                      type="text"
                                      name="fecha"
                                      placeholder=""
                                      className="input card-input"
                                      value={datos.fecha}
                                      readOnly
                                    />
                                  </FloatingLabel>
                                </Form.Group>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12} md={6}>
                                <Form.Group>
                                  <FloatingLabel
                                    controlId="floatingInput"
                                    label="Hora de Inicio"
                                    className="mb-3"
                                  >
                                    <Form.Control
                                      type="text"
                                      name="horai"
                                      placeholder=""
                                      className="input card-input"
                                      value={datos.horai}
                                      readOnly
                                    />
                                  </FloatingLabel>
                                </Form.Group>
                              </Col>
                              <Col xs={12} md={6}>
                                <Form.Group>
                                  <FloatingLabel
                                    controlId="floatingInput"
                                    label="Hora de Fin"
                                    className="mb-3"
                                  >
                                    <Form.Control
                                      type="text"
                                      name="horaf"
                                      placeholder=""
                                      className="input card-input"
                                      value={datos.horaf}
                                      readOnly
                                    />
                                  </FloatingLabel>
                                </Form.Group>
                              </Col>
                            </Row>
                            <Row>
                              <Form.Group>
                                <FloatingLabel
                                  controlId="floatingInput"
                                  label="Anfitrión"
                                  className="mb-3"
                                >
                                  <Form.Control
                                    type="text"
                                    name="anfitrion"
                                    placeholder=""
                                    className="input card-input"
                                    value={datos.anfitrion}
                                    readOnly
                                  />
                                </FloatingLabel>
                              </Form.Group>
                            </Row>
                            <Row>
                              <Form.Group>
                                <FloatingLabel
                                  controlId="floatingInput"
                                  label="Asunto"
                                  className="mb-3"
                                >
                                  <Form.Control
                                    type="text"
                                    name="asunto"
                                    placeholder=""
                                    className="input card-input"
                                    value={datos.asunto}
                                    readOnly
                                  />
                                </FloatingLabel>
                              </Form.Group>
                            </Row>
                            <Row>
                              <Form.Group>
                                <FloatingLabel
                                  controlId="floatingInput"
                                  label="Sala"
                                  className="mb-3"
                                >
                                  <Form.Control
                                    type="text"
                                    name="sala"
                                    placeholder=""
                                    className="input card-input"
                                    value={datos.sala}
                                    readOnly
                                  />
                                </FloatingLabel>
                              </Form.Group>
                            </Row>
                          </Col>
                        </Row>
                        <Row>
                          {datos.dispositivos.length > 0 ? (
                            <Col xs={12} md={6}>
                              <hr className="mt-0" />
                              <Card.Title className="titulo mb-2">Dispositivos</Card.Title>
                              <Container style={{ height: "225px", overflowY: 'auto' }}>
                                {datos.dispositivos.map((dispositivo, index) => (
                                  <React.Fragment key={index}>
                                    <Row>
                                      <Form.Group>
                                        <FloatingLabel controlId="floatingInput" label="Nombre del dispositivo" className="mb-3">
                                          <Form.Control
                                            type="text"
                                            name="ndispositivo"
                                            placeholder=""
                                            className="ndispositivo card-input"
                                            value={dispositivo.modelo || ''}
                                            readOnly
                                          />
                                        </FloatingLabel>
                                      </Form.Group>
                                    </Row>
                                    <Row>
                                      <Form.Group>
                                        <FloatingLabel controlId="floatingInput" label="Número de serie" className="">
                                          <Form.Control
                                            type="text"
                                            name="serie"
                                            placeholder=""
                                            className="input card-input"
                                            value={dispositivo.NoSerie || ''}
                                            readOnly
                                          />
                                        </FloatingLabel>
                                      </Form.Group>
                                    </Row>
                                    <hr></hr>
                                  </React.Fragment>
                                ))}
                              </Container>
                            </Col>
                          ) : null}
                          {datos.amodelo === "" ? null : (
                            <Col xs={12} md={6}>
                              <hr className="mt-0" />
                              <Card.Title className="titulo mb-2">
                                Automóvil
                              </Card.Title>
                              <Container style={{ height: "225px", overflowY: 'auto' }}>
                                <Form.Group>
                                  <FloatingLabel
                                    controlId="floatingInput"
                                    label="Modelo"
                                    className="mb-3"
                                  >
                                    <Form.Control
                                      type="text"
                                      name="amodelo"
                                      placeholder=""
                                      className="input card-input"
                                      value={datos.amodelo || ""}
                                      readOnly
                                    />
                                  </FloatingLabel>
                                </Form.Group>
                                <Form.Group>
                                  <FloatingLabel
                                    controlId="floatingInput"
                                    label="Placa"
                                    className="mb-3"
                                  >
                                    <Form.Control
                                      type="text"
                                      name="placa"
                                      placeholder=""
                                      className="input card-input"
                                      value={datos.placa || ""}
                                      readOnly
                                    />
                                  </FloatingLabel>
                                </Form.Group>
                                <Form.Group>
                                  <FloatingLabel
                                    controlId="floatingInput"
                                    label="Color"
                                    className="mb-3"
                                  >
                                    <Form.Control
                                      type="text"
                                      name="color"
                                      placeholder=""
                                      className="input card-input"
                                      value={datos.color || ""}
                                      readOnly
                                    />
                                  </FloatingLabel>
                                </Form.Group>
                              </Container>
                            </Col>
                          )}
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                </Row>
              </Col>
            </Row>
          </div>
        </Row>
      </Container>

      {/* Modal de éxito */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button className="boton" onClick={() => setShowSuccessModal(false)} type="">
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default VisualizarDatos;
