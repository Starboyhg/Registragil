import {  Container,  Card,  CardBody, CardText,  Row, Col, Button,  Form,  FloatingLabel,  Modal,  Image } from "react-bootstrap";
import React, { useState, useEffect, useRef } from "react";
import "../CSS/Administrador.css";
import "../CSS/PagPrincipalusuarios.css";
import BarraSuperiorForm from "./BarraSuperiorForm";
import { FooterPG } from "../Footer";
import PerfilD from "../imgs/user.png";
import { useParams, useLocation } from "react-router-dom";

function FormInv() {
  const location = useLocation();
  const initialValues = {
    nombre: "",
    apaterno: "",
    amaterno: "",
    telefono: "",
    empresa: "",
    documento: "",
    fotografia: "",
    acompañantes: "no",
    correoAcompañante1: "",
    correoAcompañante2: "",
    dispositivos: 0,
    modelo1: "",
    serie1: "",
    modelo2: "",
    serie2: "",
    modelo3: "",
    serie3: "",
    automovil: "no",
    amodelo: "",
    placa: "",
    color: "",
    sala: "",
    fecha: "",
    horaInicio: "",
    id_Anfitrion: "",
    correo: "",
  };

  const [no_acompañantes, setNoAcompañantes] = useState(0);
  const [values, setValues] = useState(initialValues);
  const fileInputRef = useRef(null);
  const [fotoURL, setFotoURL] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [valoresObtenidos, setValoresObtenidos] = useState({});

  useEffect(() => {
    async function getDataTable(url) {
      const params = new URLSearchParams(location.search);
      const encryptedData = params.get("data");
      console.log(encryptedData);

      if (encryptedData) {
        try {
          const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            body: JSON.stringify({ encryptedData }),
          });
          const data = await response.json();
          console.log("Respuesta del servidor:", data);
          if (data) {
            setValues((prevValues) => ({
              ...prevValues,
              sala: data.sala,
              fecha: data.fecha,
              horaInicio: data.horaInicio,
              id_Anfitrion: data.id_Anfitrion,
              correo: data.correo,
              id_Invitado: data.id_Invitado,
            }));
            setNoAcompañantes(data.cantidadDeAcompanantes);
            
            // Enviar solo el correo al archivo PHP
            const info = {
              correo: data.correo,
              fecha: data.fecha,
              horaInicio: data.horaInicio,
            };
            const correoResponse = await fetch(
              "http://localhost/RegistrAgil/RegistrarInvitado/devolverDatosInvitado.php",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(info),
              }
            );

            if (!correoResponse.ok) {
              throw new Error(
                "Error en la petición HTTP para enviar correo: " +
                  correoResponse.status
              );
            }

            const correoResult = await correoResponse.json();
            // console.log("Respuesta del servidor (correo):", correoResult);

            if(correoResult.mensaje){
              console.log(correoResult.mensaje);
              setValoresObtenidos({valores: "No se encontraron datos"});
            }else{
              //Guardamos los valores obtenidos
              setValoresObtenidos(correoResult);

              //Actualizamos los valores obtenidos y mantenemos los valores que ya teniamos
              setValues((prevValues) => ({
                ...prevValues,
                nombre: correoResult.nombre,
                apaterno: correoResult.apellido_Paterno,
                amaterno: correoResult.apellido_Materno,
                telefono: correoResult.numero,
                empresa: correoResult.empresa,
              }));
              console.log("Valores guardados: ", values);

              console.log("Valores obtenidos:", valoresObtenidos);
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    getDataTable(
      "http://localhost/RegistrAgil/RegistrarInvitado/desencriptar.php"
    );
  }, []);

  const validate = (name, value) => {
    let error = "";
    switch (name) {
      case "nombre":
        if (!value) {
          error = "Este campo es obligatorio";
        } else if (/[^a-zA-ZñÑáéíóúÁÉÍÓÚüÜ ]/.test(value)) {
          error = "El formato del Nombre(s) es inválido";
        }
        break;
      case "apaterno":
        if (!value) {
          error = "Este campo es obligatorio";
        } else if (/[^a-zA-ZñÑáéíóúÁÉÍÓÚüÜ ]/.test(value)) {
          error = "El formato del Apellido Paterno es inválido";
        }
        break;
      case "amaterno":
        if (/[^a-zA-ZñÑáéíóúÁÉÍÓÚüÜ ]/.test(value)) {
          error = "El formato del Apellido Materno es inválido";
        }
        break;
      case "telefono":
        if (!value) {
          error = "Este campo es obligatorio";
        } else if (!/^\d+$/.test(value)) {
          error = "El formato del Número de Teléfono es inválido";
        } else if (value.length !== 10) {
          error = "El Número de Teléfono debe tener 10 dígitos";
        }
        break;
      case "empresa":
      case "documento":
      case "fotografia":
        if (!value) {
          error = "Este campo es obligatorio";
        }
        break;
      case "correoAcompañante1":
        if (values.acompañantes === "si" && !value) {
          error = "Este campo es obligatorio";
        } else if (
          values.acompañantes === "si" &&
          value &&
          !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value)
        ) {
          error = "El formato del correo electrónico es inválido";
        }
        break;
      case "correoAcompañante2":
        if (
          values.acompañantes === "si" &&
          value &&
          !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value)
        ) {
          error = "El formato del correo electrónico es inválido";
        }
        break;
      case "modelo1":
      case "serie1":
        if (!value && parseInt(values.dispositivos) >= 1) {
          error = "Este campo es obligatorio";
        }
        break;
      case "modelo2":
      case "serie2":
        if (!value && parseInt(values.dispositivos) >= 2) {
          error = "Este campo es obligatorio";
        }
        break;
      case "modelo3":
      case "serie3":
        if (!value && parseInt(values.dispositivos) == 3) {
          error = "Este campo es obligatorio";
        }
        break;
      case "amodelo":
      case "placa":
        if (values.automovil === "si" && !value) {
          error = "Este campo es obligatorio";
        }
        break;
      case "color":
        if (values.automovil === "si" && !value) {
          error = "Este campo es obligatorio";
        } else if (value && /[^a-zA-Z ]/.test(value)) {
          error = "El formato del Color del Automóvil es inválido";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, type } = e.target;
    const value = type === "file" ? e.target.files[0] : e.target.value;

    if (type === "file") {
      if (e.target.files.length > 0) {
        const fotoURL = URL.createObjectURL(e.target.files[0]);
        setValues((prev) => ({
          ...prev,
          [name]: e.target.files[0],
        }));
        setFotoURL(fotoURL);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      } else {
        setValues((prev) => ({
          ...prev,
          [name]: "",
        }));
        setFotoURL("");
        const error = validate(name, value);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "acompañantes" &&
          value === "no" && { correoAcompañante1: "", correoAcompañante2: "" }),
        ...(name === "automovil" &&
          value === "no" && { amodelo: "", placa: "", color: "" }),
        ...(name === "dispositivos" && {
          modelo1: "",
          serie1: "",
          modelo2: "",
          serie2: "",
          modelo3: "",
          serie3: "",
          ...Array.from({ length: parseInt(value, 10) }).reduce(
            (acc, _, index) => {
              acc[`modelo${index + 1}`] = prev[`modelo${index + 1}`];
              acc[`serie${index + 1}`] = prev[`serie${index + 1}`];
              return acc;
            },
            {}
          ),
        }),
      }));

      if (name === "acompañantes" && value === "no") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          correoAcompañante1: "",
          correoAcompañante2: "",
        }));
      } else if (name === "automovil" && value === "no") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          amodelo: "",
          placa: "",
          color: "",
        }));
      } else if (name === "dispositivos") {
        const numDispositivos = parseInt(value, 3);
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          Object.keys(newErrors).forEach((key) => {
            if (key.startsWith("modelo") || key.startsWith("serie")) {
              delete newErrors[key];
            }
          });
          for (let i = 1; i <= numDispositivos; i++) {
            newErrors[`modelo${i}`] = prevErrors[`modelo${i}`] || "";
            newErrors[`serie${i}`] = prevErrors[`serie${i}`] || "";
          }
          return newErrors;
        });
      } else {
        const error = validate(name, value);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    }
  };

  const renderDeviceFields = () => {
    let fields = [];
    for (let i = 1; i <= values.dispositivos; i++) {
      fields.push(
        <div key={`dispositivo${i}`}>
          <CardText>Dispositivo {i}</CardText>
          <Row>
            <Form.Group>
              <FloatingLabel
                controlId="floatingInput"
                label={`Modelo*`}
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  name={`modelo${i}`}
                  className="input card-input"
                  placeholder=""
                  value={values[`modelo${i}`]}
                  onChange={handleInputChange}
                  onBlur={handleInputChange}
                  isInvalid={errors[`modelo${i}`]}
                  isValid={
                    submitted && !errors[`modelo${i}`] && values[`modelo${i}`]
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors[`modelo${i}`]}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group>
              <FloatingLabel
                controlId="floatingInput"
                label={`Número de serie*`}
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  name={`serie${i}`}
                  className="input card-input"
                  placeholder=""
                  value={values[`serie${i}`]}
                  onChange={handleInputChange}
                  onBlur={handleInputChange}
                  isInvalid={errors[`serie${i}`]}
                  isValid={
                    submitted && !errors[`serie${i}`] && values[`serie${i}`]
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors[`serie${i}`]}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>
          </Row>
        </div>
      );
    }
    return fields;
  };

  const buildConfirmationMessage = () => {
    return (
      <div>
        {fotoURL && (
          <div className="text-center mb-3">
            <img
              src={fotoURL}
              alt="Fotografía del invitado"
              className="rounded-circle"
              style={{ width: "130px", height: "130px", objectFit: "cover", border: "3px solid #88c7ff9f" }}
            />
          </div>
        )}
        <p>
          <strong>Nombre: </strong> {values.nombre} {values.apaterno}{" "}
          {values.amaterno}
        </p>
        <p>
          <strong>Teléfono: </strong> {values.telefono}
        </p>
        <p>
          <strong>Empresa: </strong> {values.empresa}
        </p>
        <p>
          <strong>Documento: </strong> {values.documento}
        </p>

        {values.acompañantes === "si" && (
          <>
            <p>
              <strong>Acompañantes:</strong> {values.correoAcompañante2 ? 2 : 1}
            </p>
            <p className="ms-4">1. {values.correoAcompañante1}</p>
            {values.correoAcompañante2 && (
              <p className="ms-4">2. {values.correoAcompañante2}</p>
            )}
          </>
        )}

        {values.dispositivos > 0 && (
          <>
            <p>
              <strong>Dispositivos:</strong> {values.dispositivos}
            </p>
            {Array.from({ length: values.dispositivos }).map((_, index) => (
              <div key={`dispositivo${index + 1}`}>
                <p className="ms-4">
                  <strong>Dispositivo {index + 1}:</strong>
                </p>
                <p className="ms-5">Modelo: {values[`modelo${index + 1}`]}</p>
                <p className="ms-5">Serie: {values[`serie${index + 1}`]}</p>
              </div>
            ))}
          </>
        )}

        {values.automovil === "si" && (
          <>
            <p>
              <strong>Automóvil:</strong>
            </p>
            <p className="ms-4">Modelo: {values.amodelo}</p>
            <p className="ms-4">Placa: {values.placa}</p>
            <p className="ms-4">Color: {values.color}</p>
          </>
        )}
      </div>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    const updatedErrors = Object.keys(values).reduce((acc, key) => {
      acc[key] = validate(key, values[key]);
      return acc;
    }, {});

    setErrors(updatedErrors);

    const fieldErrors = Object.entries(updatedErrors).filter(
      ([key, value]) => value !== ""
    );
    const hasFieldErrors = fieldErrors.length > 0;

    const requiredFields = [
      "nombre",
      "apaterno",
      "telefono",
      "empresa",
      "fotografia",
      "documento",
    ];
    const missingFields = requiredFields.filter((field) => !values[field]);
    if (missingFields.length > 0) {
      console.error("Campos obligatorios faltantes:", missingFields);
      return;
    }

    if (hasFieldErrors) {
      console.error("Error en los campos:", Object.fromEntries(fieldErrors));
      return;
    }

    if (values.acompañantes === "si" && !values.correoAcompañante1) {
      console.error("Información faltante de acompañantes");
      return;
    }

    if (
      values.automovil === "si" &&
      (!values.amodelo || !values.placa || !values.color)
    ) {
      console.error("Información faltante del automóvil");
      return;
    }

    if (values.dispositivos > 0) {
      for (let i = 1; i <= values.dispositivos; i++) {
        if (!values[`modelo${i}`] || !values[`serie${i}`]) {
          console.error("Campos faltantes de dispositivos");
          return;
        }
      }
    }

    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    setShowConfirmModal(false);
    //enviar peticion
    try {
      const formDataToSend = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      console.log("fotografia");
      console.log(formDataToSend.get("fotografia"));
      console.log(values.id_Anfitrion);
      console.log("Datos a enviar:", formDataToSend);
      const response = await fetch(
        "http://localhost/RegistrAgil/RegistrarInvitado/registrarInv2.php",
        {
          method: "POST",
          mode: "cors",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error("Error al enviar los datos.");
      }

      const data = await response.json();
      console.log("Respuesta del servidor:", data);
      setModalTitle("Datos Registrados");
      setModalMessage("El invitado se ha registrado con éxito.");
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
      setModalTitle("Datos No Registrados");
      setModalMessage("Ocurrió un error al enviar los datos.");
      setShowSuccessModal(true);
    }
    setModalTitle("Datos Registrados");
    setModalMessage(`Tus datos se han registrado con éxito. Se ha enviado a tu correo electrónico tu usuario y contraseña para iniciar sesión y ver tu código QR de acceso.`);
    setShowSuccessModal(true);
    setValues(initialValues);
    setFotoURL("");
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    setErrors({});
    setSubmitted(false);
  };

  return (
    <>
      <BarraSuperiorForm></BarraSuperiorForm>
      <Container
        fluid
        id="FormInv"
        className="mainContainer d-flex justify-content-center m-0"
        style={{ backgroundColor: "#F0F8FF" }}
      >
        <Row
          className="d-flex justify-content-center m-0"
          style={{ width: "60%" }}
        >
          <Card className="card-datos d-flex justify-content-center">
            <CardBody>
              <Card.Title className="mt-2 mb-4 titulo">
                Registro de Invitados
              </Card.Title>
              <Card.Text className="mb-4">
                Para completar su registro, ingrese los siguientes datos.
              </Card.Text>
              <Form method="post" noValidate onSubmit={handleSubmit}>
                <Row>
                  <Col xs={12} lg={4} className="d-flex align-items-center justify-content-center">
                    <Container className="text-center">
                      <Image
                        src={fotoURL ? fotoURL : (valoresObtenidos.valores ? PerfilD : `data:image/jpeg;base64,${valoresObtenidos.foto}`)}
                        alt="Fotografía del Empleado"
                        className="rounded-circle Usuario card-foto mb-4"
                      />
                    </Container>
                  </Col>
                  <Col xs={12} lg={8}>
                    <Row>
                      <Form.Group>
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Nombre(s)*"
                          className="mb-3"
                        >
                          <Form.Control
                            type="text"
                            name="nombre"
                            className="input card-input"
                            value={values.nombre}
                            placeholder=""
                            onChange={handleInputChange}
                            onBlur={handleInputChange}
                            isInvalid={errors.nombre}
                            isValid={
                              submitted && !errors.nombre && values.nombre
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.nombre}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group as={Col} xs={12} lg={6}>
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Apellido Paterno*"
                          className="mb-3"
                        >
                          <Form.Control
                            type="text"
                            name="apaterno"
                            className="input card-input"
                            placeholder=""
                            value={values.apaterno}
                            onChange={handleInputChange}
                            onBlur={handleInputChange}
                            isInvalid={errors.apaterno}
                            isValid={
                              submitted && !errors.apaterno && values.apaterno
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.apaterno}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Form.Group>
                      <Form.Group as={Col} xs={12} lg={6}>
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Apellido Materno"
                          className="mb-3"
                        >
                          <Form.Control
                            type="text"
                            name="amaterno"
                            className="input card-input"
                            placeholder=""
                            value={values.amaterno}
                            onChange={handleInputChange}
                            onBlur={handleInputChange}
                            isInvalid={errors.amaterno}
                            isValid={
                              submitted && !errors.amaterno && values.amaterno
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.amaterno}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group>
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Fotografía*"
                          className="mb-3"
                        >
                          <Form.Control
                            type="file"
                            name="fotografia"
                            className="card-input"
                            accept=".jpg, .png" // Aceptar solo imágenes JPG y PNG
                            ref={fileInputRef}
                            onChange={handleInputChange}
                            isInvalid={errors.fotografia}
                            isValid={
                              submitted &&
                              !errors.fotografia &&
                              values.fotografia
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.fotografia}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Form.Group>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Form.Group>
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Número de Teléfono*"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        name="telefono"
                        className="input card-input"
                        placeholder=""
                        value={values.telefono}
                        onChange={handleInputChange}
                        onBlur={handleInputChange}
                        isInvalid={errors.telefono}
                        isValid={
                          submitted && !errors.telefono && values.telefono
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.telefono}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group>
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Empresa en la que trabaja*"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        name="empresa"
                        className="input card-input"
                        placeholder=""
                        value={values.empresa}
                        onChange={handleInputChange}
                        onBlur={handleInputChange}
                        isInvalid={errors.empresa}
                        isValid={submitted && !errors.empresa && values.empresa}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.empresa}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group>
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Documento de identidad*"
                      className="mb-3"
                    >
                      <Form.Select
                        name="documento"
                        id="documento"
                        value={values.documento}
                        className="card-input"
                        onChange={handleInputChange}
                        isInvalid={errors.documento}
                        isValid={
                          submitted && !errors.documento && values.documento
                        }
                      >
                        <option value="" disabled>
                          Seleccione una opción
                        </option>
                        <option value="Credencial para votar">
                          Credencial para votar
                        </option>
                        <option value="Pasaporte">Pasaporte</option>
                        <option value="Cartilla del Servicio Militar">
                          Cartilla del Servicio Militar
                        </option>
                        <option value="Licencia o permiso para conducir">
                          Licencia o permiso para conducir
                        </option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.documento}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </Row>
                {no_acompañantes > 0 && (
                  <Row>
                    <Form.Group>
                      <FloatingLabel
                        controlId="floatingInput"
                        label="¿Llevará acompañantes?*"
                        className="mb-3"
                      >
                        <Form.Select
                          name="acompañantes"
                          id="acompañantes"
                          className="card-input"
                          value={values.acompañantes}
                          onChange={handleInputChange}
                        >
                          <option value="no">No</option>
                          <option value="si">Si</option>
                        </Form.Select>
                      </FloatingLabel>
                    </Form.Group>
                  </Row>
                )}
                {values.acompañantes === "si" && (
                  <>
                    <Row>
                      <Form.Group>
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Correo Electrónico del Acompañante 1*"
                          className="mb-3"
                        >
                          <Form.Control
                            type="text"
                            name="correoAcompañante1"
                            className="input card-input"
                            placeholder=""
                            value={values.correoAcompañante1}
                            onChange={handleInputChange}
                            onBlur={handleInputChange}
                            isInvalid={errors.correoAcompañante1}
                            isValid={
                              submitted &&
                              !errors.correoAcompañante1 &&
                              values.correoAcompañante1
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.correoAcompañante1}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Form.Group>
                    </Row>
                    {no_acompañantes === 2 && (
                      <Row>
                        <Form.Group>
                          <FloatingLabel
                            controlId="floatingInput"
                            label="Correo Electrónico del Acompañante 2*"
                            className="mb-3"
                          >
                            <Form.Control
                              type="text"
                              name="correoAcompañante2"
                              className="input card-input"
                              placeholder=""
                              value={values.correoAcompañante2}
                              onChange={handleInputChange}
                              onBlur={handleInputChange}
                              isInvalid={errors.correoAcompañante2}
                              isValid={
                                submitted &&
                                !errors.correoAcompañante2 &&
                                values.correoAcompañante2
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.correoAcompañante2}
                            </Form.Control.Feedback>
                          </FloatingLabel>
                        </Form.Group>
                      </Row>
                    )}
                  </>
                )}
                <Row>
                  <Form.Group>
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Número de dispositivos que llevará*"
                      className="mb-3"
                    >
                      <Form.Select
                        name="dispositivos"
                        id="dispositivos"
                        className="card-input"
                        value={values.dispositivos}
                        onChange={handleInputChange}
                      >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </Form.Select>
                    </FloatingLabel>
                  </Form.Group>
                </Row>
                {renderDeviceFields()}
                <Row>
                  <Form.Group>
                    <FloatingLabel
                      controlId="floatingInput"
                      label="¿Llevará automóvil?*"
                      className="mb-3"
                    >
                      <Form.Select
                        name="automovil"
                        id="automovil"
                        value={values.automovil}
                        className="card-input"
                        onChange={handleInputChange}
                      >
                        <option value="no">No</option>
                        <option value="si">Si</option>
                      </Form.Select>
                    </FloatingLabel>
                  </Form.Group>
                </Row>
                {values.automovil === "si" && (
                  <>
                    <Row>
                      <Form.Group>
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Modelo*"
                          className="mb-3"
                        >
                          <Form.Control
                            type="text"
                            name="amodelo"
                            className="input card-input"
                            placeholder=""
                            value={values.amodelo}
                            onChange={handleInputChange}
                            onBlur={handleInputChange}
                            isInvalid={errors.amodelo}
                            isValid={
                              submitted && !errors.amodelo && values.amodelo
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.amodelo}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group>
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Placa*"
                          className="mb-3"
                        >
                          <Form.Control
                            type="text"
                            name="placa"
                            className="input card-input"
                            placeholder=""
                            value={values.placa}
                            onChange={handleInputChange}
                            onBlur={handleInputChange}
                            isInvalid={errors.placa}
                            isValid={submitted && !errors.placa && values.placa}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.placa}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group>
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Color*"
                          className="mb-3"
                        >
                          <Form.Control
                            type="text"
                            name="color"
                            className="input card-input"
                            placeholder=""
                            value={values.color}
                            onChange={handleInputChange}
                            onBlur={handleInputChange}
                            isInvalid={errors.color}
                            isValid={submitted && !errors.color && values.color}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.color}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Form.Group>
                    </Row>
                  </>
                )}
                <Row className="justify-content-end mt-4">
                  <Form.Group as={Col} xs="auto">
                    <Button className="boton" type="submit">
                      Enviar
                    </Button>
                  </Form.Group>
                </Row>
              </Form>
            </CardBody>
          </Card>
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
        <Modal.Body>
          {modalMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button className="boton" onClick={() => setShowSuccessModal(false)}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
      <FooterPG></FooterPG>
    </>
  );
}

export default FormInv;
