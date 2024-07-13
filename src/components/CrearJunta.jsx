import { Container, Card, CardBody, Row, Col, Button, Form, FloatingLabel, Image, Modal } from "react-bootstrap";
import Eliminar from "../imgs/eliminar.png";
import Agregar from "../imgs/agregar.png";
import React, { useState } from "react";
import "../CSS/Administrador.css";

function CrearJunta() {
  const initialValues = ({
    asunto: "",
    sala: "",
    fecha: "",
    horai: "",
    horaf: "",
    invitados: [],
    descripcion: "",
    direccion: "",
  });
  const [values, setValues] = useState(initialValues);
  const [newInvitado, setNewInvitado] = useState({
    correo: "",
    acompañantes: "0",
  });

  let date = new Date().toISOString().split("T")[0];
  let time = new Date().toTimeString().split(" ")[0].slice(0, 5);
  const requiredFields = [
    "asunto",
    "sala",
    "fecha",
    "horai",
    "horaf",
    "descripcion",
    "direccion",
  ];
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const initialErrors = ({
    asunto: "",
    sala: "",
    fecha: "",
    horai: "",
    horaf: "",
    descripcion: "",
    direccion: "",
    newInvitado: {
      correo: "",
      acompañantes: "",
    },
  });

  const [errors, setErrors] = useState(initialErrors);
  const validate = (name, value) => {
    let error = "";
    switch (name) {
      case "asunto":
      case "sala":
      case "descripcion":
      case "direccion":
        if (!value) {
          error = "Este campo es obligatorio";
        }
        break;
      case "horai":
        time = new Date().toTimeString().split(" ")[0].slice(0, 5);
        if (!value) {
          error = "Este campo es obligatorio";
        } else if (value < time && values.fecha == date) {
          error = "Hora inválida";
        }
        break;
      case "horaf":
        time = new Date().toTimeString().split(" ")[0].slice(0, 5);
        if (!value) {
          error = "Este campo es obligatorio";
        } else if (
          (value <= time && values.fecha == date) ||
          value <= values.horai
        ) {
          error = "Hora inválida";
        }
        break;
      case "correo":
        if (
          value &&
          !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value)
        ) {
          error = "El formato del correo electrónico es inválido";
        }
        break;
      case "fecha":
        date = new Date().toISOString().split("T")[0];
        if (!value) {
          error = "Este campo es obligatorio";
        } else if (value < date) {
          error = "Fecha inválida";
        }
        break;
    }
    return error;
  };

  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;
    let error = validate(name, value);

    if (index !== null) {
      const newInvitados = values.invitados.map((invitado, i) =>
        i === index ? { ...invitado, [name]: value } : invitado
      );
      const newErrors = errors.invitados.map((error, i) =>
        i === index ? { ...error, [name]: validate(name, value) } : error
      );
      setValues({ ...values, invitados: newInvitados });
      setErrors({ ...errors, invitados: newErrors });
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleNewInvitadoChange = (e) => {
    const { name, value } = e.target;
    let error = validate(name, value);
    setNewInvitado((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      newInvitado: { ...prev.newInvitado, [name]: error },
    }));
  };

  const addInvitado = () => {
    let correoError = validate("correo", newInvitado.correo);
    if (!correoError && !newInvitado.correo) {
      correoError = "Este campo es obligatorio";
    }
    if (correoError) {
      setErrors((prev) => ({
        ...prev,
        newInvitado: { ...prev.newInvitado, correo: correoError },
      }));
      return;
    }
    const correoExiste = values.invitados.some(
      (invitado) => invitado.correo === newInvitado.correo
    );
    if (correoExiste) {
      setErrors((prev) => ({
        ...prev,
        newInvitado: { ...prev.newInvitado, correo: "Correo electrónico repetido" },
      }));
      return;
    }
    setValues((prev) => ({
      ...prev,
      invitados: [...prev.invitados, newInvitado],
    }));
    setNewInvitado({ correo: "", acompañantes: "0" });
    setErrors((prev) => ({
      ...prev,
      newInvitado: { correo: "", acompañantes: "" },
    }));
  };

  const removeInvitado = (index) => {
    const newInvitados = values.invitados.filter((_, i) => i !== index);
    setValues({ ...values, invitados: newInvitados });
  };

  const buildConfirmationMessage = () => {
    return (
      <div>
        <p>
          <strong>Asunto de la Junta: </strong> {values.asunto}
        </p>
        <p>
          <strong>Sala de Juntas: </strong> {values.sala}
        </p>
        <p>
          <strong>Fecha: </strong> {values.fecha}
        </p>
        <p>
          <strong>Hora de Inicio: </strong> {values.horai}
        </p>
        <p>
          <strong>Hora de Fin: </strong> {values.horaf}
        </p>
        <p>
          <strong>Dirección: </strong> {values.direccion}
        </p>
        <p>
          <strong>Descripción: </strong> {values.descripcion}
        </p>
        <p>
          <strong>Invitados: </strong> {values.invitados.length}
        </p>
        {values.invitados.map((invitado, index) => (
          <p key={index} className="ms-4">
            {index + 1}. {invitado.correo} -{" "}
            {invitado.acompañantes > 0
              ? `${invitado.acompañantes} acompañante${invitado.acompañantes > 1 ? "s" : ""
              }`
              : "sin acompañantes"}
          </p>
        ))}
      </div>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    const updatedErrors = { ...errors };
    requiredFields.forEach((field) => {
      updatedErrors[field] = validate(field, values[field]);
    });

    let correoExiste = values.invitados.some(
      (invitado) => invitado.correo === newInvitado.correo
    );
    let newInvitadoError = validate("correo", newInvitado.correo);
    if (newInvitado.correo && !newInvitadoError && !correoExiste) {
      newInvitadoError = "Agregar Invitado";
    }

    if (newInvitadoError) {
      setErrors((prev) => ({
        ...prev,
        newInvitado: { ...prev.newInvitado, correo: newInvitadoError },
      }));
      console.error("Error en el correo del nuevo invitado:", newInvitadoError);
      return;
    }

    setErrors(updatedErrors);

    const missingFields = requiredFields.filter((field) => !values[field]);
    if (missingFields.length > 0) {
      console.error("Campos obligatorios faltantes:", missingFields);
      return;
    }

    const correoAnfitrion = window.localStorage.getItem("correo");
    values.correoAnfitrion = correoAnfitrion;
    console.log(values);
    setShowConfirmModal(true);
  };

  const enviarCorreo = async (correos) => {
    //Imprimimos cantidad de correos a los que se enviará el correo
    console.log(`Cantidad de correos a enviar: ${correos.length}`);
    console.log(`Enviando correo a: ${correos}`);
    const response = await fetch("http://localhost/RegistrAgil/RegistrarInvitado/enviarCorreo.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        destinatarios: correos,
        hora_inicio: values.horai,
        fecha: values.fecha,
        sala: values.sala,
        descripcion: values.descripcion,
        correo_anfitrion: values.correoAnfitrion,
        direccion: values.direccion,
      }),
    });

    // console.log("Esperando respuesta del servidor...");

    const data = await response.text();
    console.log("Respuesta del servidor:", data);
    // if (data.success) {
    //   console.log(`Correo enviado a ${correos}`);
    // } else {
    //   console.error(`Error al enviar correo: ${data.message}`);
    // }
  };

  const handleConfirm = async () => {
    setShowConfirmModal(false);
    try {
      const response = await fetch(
        "http://localhost/RegistrAgil/GestionarJuntas/Crear_Junta.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      const responseData = await response.text();
      console.log("Raw response data:", responseData); // Log raw response data

      try {
        const data = JSON.parse(responseData);
        if (!response.ok) {
          throw new Error(data.error || "Error al enviar los datos.");
        }

        //Llamamos a la función enviarCorreo para enviar el correo a los invitados, pasando como parámetro un arreglo con los correos de los invitados
        //Pero antes, guardamos los correos en una variable para poder enviarlos
        const correos = values.invitados.map((invitado) => invitado.correo);
        enviarCorreo(correos);
        

        console.log("Respuesta del servidor:", data);
        setModalTitle("Datos Registrados");
        setModalMessage("La junta se ha creado con éxito.");
        setShowSuccessModal(true);

        setValues(initialValues);
        setNewInvitado({ correo: "", acompañantes: "0" });
        setErrors(initialErrors);
        setSubmitted(false);
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        throw new Error("Invalid JSON response from server.");
      }
    } catch (error) {
      console.error(error);
      setModalTitle("Datos No Registrados");
      setModalMessage("Ocurrió un error al enviar los datos.");
      setShowSuccessModal(true);
    }
  };

  return (
    <>
      <Container
        fluid
        id="CrearJunta"
        className="mainContainer d-flex justify-content-center"
      >
        <Row
          className="d-flex justify-content-center mb-5"
          style={{ width: "80%" }}
        >
          <div>
            <Card.Title className="mt-5 mb-4 titulo">Crear Junta</Card.Title>
            <Card className="card-datos d-flex justify-content-center">
              <CardBody>
                <Form metod="post" noValidate onSubmit={handleSubmit}>
                  <Row>
                    <Form.Group>
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Asunto de la Junta*"
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          name="asunto"
                          className="input card-input"
                          placeholder=""
                          value={values.asunto}
                          onChange={handleInputChange}
                          onBlur={handleInputChange}
                          isInvalid={errors.asunto}
                          isValid={submitted && !errors.asunto && values.asunto}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.asunto}
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group>
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Sala de Juntas*"
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          name="sala"
                          className="input card-input"
                          placeholder=""
                          value={values.sala}
                          onChange={handleInputChange}
                          onBlur={handleInputChange}
                          isInvalid={errors.sala}
                          isValid={submitted && !errors.sala && values.sala}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.sala}
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group>
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Fecha de la junta*"
                        className="mb-3"
                      >
                        <Form.Control
                          type="date"
                          name="fecha"
                          className="input card-input"
                          value={values.fecha}
                          min={date}
                          onChange={handleInputChange}
                          isInvalid={errors.fecha}
                          isValid={submitted && !errors.fecha && values.fecha}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.fecha}
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col} xs={12} md={6}>
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Hora de inicio*"
                        className="mb-3"
                      >
                        <Form.Control
                          type="time"
                          name="horai"
                          className="input card-input"
                          value={values.horai}
                          onChange={handleInputChange}
                          isInvalid={errors.horai}
                          isValid={submitted && !errors.horai && values.horai}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.horai}
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col} xs={12} md={6}>
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Hora de fin*"
                        className="mb-3"
                      >
                        <Form.Control
                          type="time"
                          name="horaf"
                          className="input card-input"
                          value={values.horaf}
                          onChange={handleInputChange}
                          isInvalid={errors.horaf}
                          isValid={submitted && !errors.horaf && values.horaf}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.horaf}
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group>
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Dirección*"
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          name="direccion"
                          className="input card-input"
                          placeholder=""
                          value={values.direccion}
                          onChange={handleInputChange}
                          onBlur={handleInputChange}
                          isInvalid={errors.direccion}
                          isValid={
                            submitted && !errors.direccion && values.direccion
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.direccion}
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group>
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Descripción*"
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          name="descripcion"
                          className="input card-input"
                          placeholder=""
                          value={values.descripcion}
                          onChange={handleInputChange}
                          onBlur={handleInputChange}
                          isInvalid={errors.descripcion}
                          isValid={
                            submitted &&
                            !errors.descripcion &&
                            values.descripcion
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.descripcion}
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Col xs={12} md={6}>
                      <Form.Group>
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Correo Electrónico del Invitado*"
                          className="mb-3"
                        >
                          <Form.Control
                            type="text"
                            name="correo"
                            className="input card-input"
                            placeholder=""
                            value={newInvitado.correo}
                            onChange={handleNewInvitadoChange}
                            onBlur={handleNewInvitadoChange}
                            isInvalid={errors.newInvitado.correo}
                            isValid={
                              !errors.newInvitado.correo && newInvitado.correo
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.newInvitado.correo}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Form.Group>
                    </Col>
                    <Col xs={9} md={4}>
                      <Form.Group>
                        <FloatingLabel
                          controlId="floatingInput"
                          label="No. acompañantes"
                          className="mb-3"
                        >
                          <Form.Select
                            name="acompañantes"
                            className="card-input"
                            value={newInvitado.acompañantes}
                            onChange={handleNewInvitadoChange}
                          >
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                          </Form.Select>
                        </FloatingLabel>
                      </Form.Group>
                    </Col>
                    <Col xs={3} md={2}>
                      <Row className="justify-content-center mt-2">
                        <Form.Group as={Col} xs="auto">
                          <Button
                            className="boton"
                            type="button"
                            onClick={addInvitado}
                          >
                            <Image
                              src={Agregar}
                              alt="Agregar"
                              style={{ width: "20px" }}
                            />
                          </Button>
                        </Form.Group>
                      </Row>
                    </Col>
                  </Row>
                  {values.invitados.map((invitado, index) => (
                    <div key={index}>
                      <Row>
                        <Col xs={12} md={6}>
                          <Form.Group>
                            <FloatingLabel
                              controlId="floatingInput"
                              label={`Correo Electrónico del Invitado ${index + 1
                                }`}
                              className="mb-3"
                            >
                              <Form.Control
                                type="text"
                                name="correo"
                                className="input card-input"
                                placeholder=""
                                value={invitado.correo}
                                readOnly
                              />
                            </FloatingLabel>
                          </Form.Group>
                        </Col>
                        <Col xs={9} md={4}>
                          <Form.Group>
                            <FloatingLabel
                              controlId="floatingInput"
                              label="No. acompañantes"
                              className="mb-3"
                            >
                              <Form.Control
                                type="text"
                                name="acompañantes"
                                className="input card-input"
                                placeholder=""
                                value={invitado.acompañantes}
                                readOnly
                              />
                            </FloatingLabel>
                          </Form.Group>
                        </Col>
                        <Col xs={3} md={2}>
                          <Row className="justify-content-center mt-2">
                            <Form.Group as={Col} xs="auto">
                              <Button
                                className="boton"
                                type="button"
                                onClick={() => removeInvitado(index)}
                              >
                                <Image
                                  src={Eliminar}
                                  alt="Eliminar"
                                  style={{ width: "20px" }}
                                />
                              </Button>
                            </Form.Group>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <Row className="justify-content-end mt-4">
                    <Form.Group as={Col} xs="auto">
                      <Button className="boton" type="submit">
                        Crear Junta
                      </Button>
                    </Form.Group>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>

      {/* Modal de confirmación */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Por favor, verifica que los datos ingresados son correctos.</p>
          {buildConfirmationMessage()}
        </Modal.Body>
        <Modal.Footer>
          <div className="w-100 d-flex justify-content-between">
            <Button
              className="boton"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancelar
            </Button>
            <Button className="boton" onClick={handleConfirm}>
              Confirmar
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

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
          <Button className="boton" onClick={() => setShowSuccessModal(false)}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CrearJunta;
