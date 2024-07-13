import React, { useState, useEffect } from "react";
import { Container, Card, Form, Row, Image, Col, Button, FloatingLabel, Modal } from "react-bootstrap";
import "./CSS/Administrador.css";
import PerfilD from "./imgs/user.png";
import "./PantGesEmp.css";
// import "./CSS/JuntasPendientes.css";

function PantGesEmp() {
  const [correo, setCorreo] = useState("");
  const [mostrarElemento, setMostrarElemento] = useState(true);
  const [edicionHabilitada, setEdicionHabilita] = useState(false);
  const [emp, SetEmp] = useState([]);
  const [peticionRealizada, SetPeticion] = useState(true);
  const [empleado, SetEmpleado] = useState({});
  const [edicionEmpleado, SetEdicionEmpleado] = useState({});
  const [recienBorrado, SetRecienBorrado] = useState(false);
  const [busquedaExitosa, setBusquedaExitosa] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [telefono, setTelefono] = useState("");
  const [switchChecked, setSwitchChecked] = useState(false);

  const handleTelefonoChange = (e) => {//validación teléfono
    const value = e.target.value;
    setTelefono(value);

    const phoneRegex = /^[0-9]{10}$/;
    setIsInvalid(!phoneRegex.test(value));
  };

  useEffect(() => {
    habilitarInfo();
  }, [empleado, edicionHabilitada, showDeleteModal]);

  useEffect(() => {
    if (!peticionRealizada) {
      SetEmpleado({});
      async function getDataTable(url) {
        const response = await fetch(url, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correo: correo,
          }),
        });
        const json = await response.json();
        if (json.error) {
          console.log(json.error);
          SetEmpleado({});
          setBusquedaExitosa(false);
          if (!recienBorrado) {
            setModalTitle("Empleado No Encontrado");
            setModalMessage("El correo introducido no pertenece a un empleado registrado.");
            setShowSuccessModal(true);
          } else {
            SetRecienBorrado(false);
          }
        } else {
          console.log("Consulta exitosa");
          SetEmpleado(json);
          setBusquedaExitosa(true);
        }
      }
      getDataTable(
        "http://localhost/RegistrAgil/RegistrarEmpleado/VisualizarEmp.php"
      );
      SetPeticion(true);
    }
  }, [peticionRealizada]);

  const toggleElemento = () => {
    setMostrarElemento(!mostrarElemento);
    setEdicionHabilita(false);
  };

  function habilitarInfo() {
    let info = [];

    if (empleado.nombre && busquedaExitosa) {
      info.push(
        <Card.Title className="mb-4 titulo" key={empleado.correo + "1"} style={{ display: mostrarElemento ? "none" : "flex" }}>
          Editar Empleado
        </Card.Title>
      );
      info.push(
        <Card.Title className="mt-5 mb-4 titulo" key={empleado.correo + "2"} style={{ display: mostrarElemento ? "flex" : "none" }}>Datos del Empleado</Card.Title>
      );
      info.push(
        <div key={empleado.correo + "3"}>
          <Card className="card-datos d-flex justify-content-center">
            <Card.Body>
              <Form noValidate validated={!isInvalid} onSubmit={editarEmpleado}>
                <Row>
                  <Col xs={12} lg={3}>
                    <Container className="text-center mt-2">
                      <Image
                        src={empleado.fotografia ? `data:image/jpeg;base64,${empleado.fotografia}` : PerfilD}
                        alt="Fotografia empleado"
                        className="rounded-circle card-foto Usuario mt-2 mb-1"
                        style={{ width: '100%', maxWidth: '130px', minWidth: '100px', minHeight: '100px', maxHeight: '130px', objectFit: 'cover' }}
                      />
                    </Container>
                  </Col>
                  <Col xs={12} lg={9} className="mt-2">
                    <Row className="mb-2">
                      <Form.Group as={Col} xs={12} lg={4}>
                        <Form.Label className="mb-1">Nombre(s)</Form.Label>
                        <Form.Control
                          type="text"
                          className="input card-inputJP mb-1"
                          defaultValue={empleado.nombre}
                          disabled
                        />
                      </Form.Group>
                      <Form.Group as={Col} xs={12} lg={4}>
                        <Form.Label className="mb-1">Apellido Paterno</Form.Label>
                        <Form.Control
                          defaultValue={empleado.apellidoPat}
                          type="text"
                          className="input card-inputJP mb-1"
                          disabled
                        />
                      </Form.Group>
                      <Form.Group as={Col} xs={12} lg={4}>
                        <Form.Label className="mb-1">Apellido Materno</Form.Label>
                        <Form.Control
                          type="text"
                          className="input card-inputJP mb-1"
                          defaultValue={empleado.apellidoMat}
                          disabled
                        />
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group as={Col} xs={12} lg={6}>
                        <Form.Label className="mb-1">Correo Electrónico</Form.Label>
                        <Form.Control
                          type="text"
                          id="correo"
                          className="input card-inputJP mb-1"
                          disabled
                          defaultValue={empleado.correo}
                        />
                      </Form.Group>
                      <Form.Group as={Col} xs={12} lg={6}>
                        <Form.Label className="mb-1">Telefóno{edicionHabilitada ? '*' : ''}</Form.Label>
                        <Form.Control
                          type="tel"
                          id="telefono"
                          defaultValue={empleado.telefono}
                          onChange={handleTelefonoChange}
                          className="input card-inputJP mb-1"
                          disabled={!edicionHabilitada}
                          /* isInvalid={isInvalid && edicionHabilitada}
                          isValid={isValid && edicionHabilitada} */
                          isInvalid={isInvalid && edicionHabilitada}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {!isInvalid &&
                            "Por favor ingrese un número de teléfono válido."}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>
                  </Col>
                  <Col>
                    {/* verificamos si la direccion existe */}
                    {empleado.direccion == null ? (<div className="mt-1 mb-2"></div>) : <Row className="mt-1 mb-2">
                      <Form.Group>
                        <Form.Label className="mb-1">Dirección</Form.Label>
                        <Form.Control
                          type="text"
                          className="input card-inputJP mb-1"
                          defaultValue={empleado.direccion}
                          disabled
                        />
                      </Form.Group>
                    </Row>}
                    <Row>
                      <Form.Group as={Col} xs={12} lg={6} className="mb-1">
                        <Form.Label className="mb-1">Departamento{edicionHabilitada ? '*' : ''}</Form.Label>
                        <Form.Control
                          type="text"
                          id="departamento"
                          className="input card-inputJP mb-1"
                          required
                          defaultValue={empleado.departamento}
                          disabled={!edicionHabilitada}
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor llena el dato
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group as={Col} xs={12} lg={6}>
                        <Form.Label className="mb-1">Permisos{edicionHabilitada ? '*' : ''}</Form.Label>
                        <Form.Select
                          name="permisos"
                          id="permisos"
                          className="card-inputJP mb-1"
                          defaultValue={empleado.permisos}
                          disabled={!edicionHabilitada}

                        >
                          <option value="" disabled>Seleccione una opción</option>
                          <option value="Anfitrion">Anfitrion</option>
                          <option value="Recepcionista">Recepcionista</option>
                        </Form.Select>
                      </Form.Group>
                    </Row>
                    <Row className="mt-3 mb-1" style={{ display: mostrarElemento ? "none" : "flex" }}>
                      <Form.Group as={Col} xs={12} className="custom-switch d-flex align-items-center">
                        <Form.Label className="me-3">Nueva Contraseña</Form.Label>
                        <Form.Check
                          type="switch"
                          id="nueva-contraseña"
                          // label=""
                          // checked={switchChecked}
                          defaultChecked={switchChecked}
                          onChange={handleSwitchChange}
                        />
                      </Form.Group>
                    </Row>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 d-flex justify-content-between mt-4">
            <Button className="boton boton-ge" style={{ display: mostrarElemento ? "flex" : "none" }} onClick={() => setShowDeleteModal(true)}>
              Eliminar
            </Button>
            <Button className="boton boton-ge" style={{ display: mostrarElemento ? "none" : "flex" }} onClick={toggleElemento}>
              Cancelar
            </Button>
            <Button className="boton boton-ge" style={{ display: mostrarElemento ? "flex" : "none" }} onClick={habilitarEdicion}>
              Editar
            </Button>
            <Button className="boton boton-ge" style={{ display: mostrarElemento ? "none" : "flex" }} onClick={handleSubmitEditar}>
              Confirmar
            </Button>
          </div>
        </div>
      );
      SetEmp(info);
    } else {
      SetEmp([]);
      setSwitchChecked(false);
    }
  }

  const handleCancel = () => {
    setCorreo("");
    SetEmpleado({});
    setBusquedaExitosa(false);
    setSwitchChecked(false);
  };

  const handleSubmit = async (e) => {
    if (e !== undefined) {
      e.preventDefault();
    }
    SetPeticion(false);
  };

  const handleSubmitEditar = async (e) => {
    e.preventDefault();

    const departamentoInput = document.getElementById("departamento").value;


    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(document.getElementById("telefono").value)) {
      setIsInvalid(true);
      setIsValid(false);
      setModalTitle("Error en el formulario")
      setModalMessage("Por favor, ingrese un número de teléfono válido.");
      setShowSuccessModal(true);
      return;
    }else{
        setIsInvalid(false);
    }

    if (departamentoInput.trim() === "") {
      setModalTitle("Error en el formulario");
      setModalMessage("Por favor, seleccione un departamento.");
      setShowSuccessModal(true);
      return;
    }

    /* if (isInvalid) {
      alert("Por favor, ingrese un número de teléfono válido.");
      return;
    } */

    edicionEmpleado.correo = document.getElementById("correo").value;
    edicionEmpleado.telefono = document.getElementById("telefono").value;
    edicionEmpleado.permisos = document.getElementById("permisos").value;
    edicionEmpleado.departamento = document.getElementById("departamento").value;
    // edicionEmpleado.nueva = document.getElementById("nueva-contraseña").value;
    // edicionEmpleado.nueva = switchChecked;
    console.log(edicionEmpleado);

    setShowConfirmModal(true);
  };

  const handleSwitchChange=(e)=>{
    // setField('gtc', e.target.checked)
    // SetEdicionEmpleado({...edicionEmpleado, nueva: e.target.checked})
    // SetEdicionEmpleado({...edicionEmpleado, nueva: switchChecked})
    edicionEmpleado.nueva = e.target.checked;
    // setSwitchState(!switchState)
    setSwitchChecked(!switchChecked)
 }

  const habilitarEdicion = () => {
    setEdicionHabilita(true);
    setMostrarElemento(false);
    let copia = Object.assign({}, empleado);
    SetEdicionEmpleado(copia);
  };

  const editarEmpleado = async (e) => {
    e.preventDefault();
    setShowConfirmModal(false);
    console.log("Editando datos del empleado");
    const formDataToSend = new FormData();
    Object.entries(edicionEmpleado).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    const response = await fetch(
      "http://localhost/RegistrAgil/RegistrarEmpleado/EditarEmp.php",
      {
        method: "POST",
        mode: "cors",
        body: formDataToSend,
      }
    );
    const json = await response.json();
    console.log(json);
    if (json === undefined) {
      console.log(json.error);
    } else if (json.error !== undefined) {
      setModalTitle("Datos No Editados");
      setModalMessage("Ocurrió un error al enviar los datos.");
      setShowSuccessModal(true);
    } else {
      setModalTitle("Datos Editados");
      setModalMessage("Los datos del empleado se han editado correctamente.");
      setShowSuccessModal(true);
      toggleElemento();
      SetPeticion(false);
      setSwitchChecked(false);
    }
  };

  const eliminarEmpleado = async (e) => {
    setShowDeleteModal(false);
    const response = await fetch(
      "http://localhost/RegistrAgil/RegistrarEmpleado/EliminarEmp.php",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empleado.correo),
      }
    );
    const json = await response.json();
    if (json === undefined) {
      console.log(json.error);
    } else if (json.error !== undefined) {
      console.log(json.error);
      setModalTitle("Empleado No Eliminado");
      setModalMessage("Ocurrió un error al enviar los datos.");
      setShowSuccessModal(true);
    } else {
      SetRecienBorrado(true);
      setShowDeleteModal(false);
      SetPeticion(false);
      setCorreo("");
      setModalTitle("Empleado Eliminado");
      setModalMessage("El empleado se ha eliminado correctamente.");
      setShowSuccessModal(true);
    }
  };
  return (
    <>
      <Container fluid id="perfil" className="mainContainer d-flex justify-content-center align-items-center mt-1">
        <Row className="d-flex justify-content-center" style={{ width: "90%" }}>
          <Card.Title className="mb-4 titulo" style={{ display: mostrarElemento ? "flex" : "none" }}>Gestionar Empleados</Card.Title>
          <div style={{ width: 'auto', display: mostrarElemento ? "flex" : "none" }}>
            <Card className="card-datos d-flex justify-content-center">
              <Card.Body>
                <Form onSubmit={handleSubmit} style={{ width: '350px' }}>
                  <Row>
                    <Form.Group>
                      <Form.Label>Introduzca el correo del empleado:</Form.Label>
                      <Form.Control
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        type="text"
                        placeholder=""
                        className="mt-1 input card-inputJP mb-1"
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group>
                      <div className="w-100 d-flex justify-content-between mt-3">
                        <Button className="boton boton-ge" onClick={handleCancel}>
                          Cancelar
                        </Button>
                        <Button className="boton boton-ge" type="submit">
                          Buscar
                        </Button>
                      </div>
                    </Form.Group>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </div>
          {emp}
        </Row>
      </Container>

      {/* Modal Eliminar Empleado */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Empleado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Se dará de baja al siguiente empleado.</p>
          <Row>
            <Col xs={12} lg={4} className="d-flex align-items-center justify-content-center">
              <Container className="text-center">
                <Image
                  src={`data:image/jpeg;base64, ` + (empleado.fotografia || "")}
                  alt="Fotografia empleado"
                  className="rounded-circle Usuario card-foto"
                />
              </Container>
            </Col>
            <Col xs={12} lg={8} className="mt-2">
              <Row>
                <Form.Group className="mt-2 mb-3">
                  <Form.Control
                    defaultValue={empleado.nombre + " " + empleado.apellidoPat + " " + empleado.apellidoMat}
                    type="text"
                    className="input card-input"
                    disabled
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Control
                    defaultValue={empleado.correo}
                    type="text"
                    className="input card-input"
                    disabled
                  />
                </Form.Group>
              </Row>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <div className="w-100 d-flex justify-content-between">
            <Button
              className="boton"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button className="boton" onClick={eliminarEmpleado}>
              Confirmar
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

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
          <p><strong>Nombre: </strong> {empleado.nombre} {empleado.apellidoPat} {empleado.apellidoMat}</p>
          <p><strong>Teléfono: </strong> {edicionEmpleado.telefono}</p>
          <p><strong>Correo Electrónico: </strong> {empleado.correo}</p>
          <p><strong>Dirección: </strong> {empleado.direccion}</p>
          <p><strong>Departamento: </strong> {edicionEmpleado.departamento}</p>
          <p><strong>Permisos: </strong> {edicionEmpleado.permisos}</p>
          <p><strong>Nueva Contraseña: </strong> {edicionEmpleado.nueva == true ? "Si" : "No"}</p>
        </Modal.Body>
        <Modal.Footer>
          <div className="w-100 d-flex justify-content-between">
            <Button
              className="boton"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancelar
            </Button>
            <Button className="boton" onClick={editarEmpleado}>
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
        centered
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

export default PantGesEmp;