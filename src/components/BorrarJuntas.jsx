import { Row, Col, Button, Modal, Form } from "react-bootstrap";
import React, { useState, useRef } from "react";
import * as Icon from "react-bootstrap-icons";
import "../CSS/BorrarJuntas.css";

async function solicitarEliminado(url, data) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

async function enviarMotivo(url, data) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

function BorrarJuntas({ setPeticion, junta }) {

  const formRef = useRef();

  const [show, setShow] = useState(false);
  const [motivo, setMotivo] = useState("");

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [tituloModal, settituloModal] = useState("");
  const [isMainModalVisible, setIsMainModalVisible] = useState(true);

  const handleClose = () => {
    setShow(false);
    setMotivo("");
  }
  const handleShow = () => setShow(true);

  const handleChange = (e) => setMotivo(e.target.value);

  const handleSubmit = async () => {
    //Si es administrador, se valida que haya llenado el campo del motivo
    //Si es anfitrion, no se valida el campo del motivo y se llena el campo con algo aleatorio para la validez de la referencia
    // if(window.localStorage.getItem("permiso") === "4"){
    //   setMotivo("Es Anfitrión");
    //   //Colocamos la referencia como valida
    // }

    if(window.localStorage.getItem("permiso") === "1"){
      console.log("Administrador borrando junta");
      event.preventDefault();
      if(formRef.current.reportValidity() === false){
        event.stopPropagation();
      }else{
        // console.log("Motivo de eliminación:", motivo);
        accion();
      }
    }else{
      console.log("Anfitrión borrando junta");
      // console.log("Motivo de eliminación:", motivo);
      accion();
    }
  };
  
  //Funcion donde meteremos la accion
  const accion = async () => {
    try {
      const data = await solicitarEliminado(
        "http://localhost/RegistrAgil/GestionarJuntas/Eliminar_Juntas.php",
        {
          hora_inicio: junta.reunion_horaInicio,
          fecha: junta.reunion_fecha,
          sala: junta.reunion_sala,
          correo: junta.anfitrion_correo,
          // motivo: motivo,
        }
      );

      if (data.success && window.localStorage.getItem("permiso") === "1") {
        
        console.log("Motivo de eliminación:", motivo);
        setPeticion(false);
        // alert("Eliminación correcta: " + data.message);
        setIsMainModalVisible(false);
        const motivoData = await enviarMotivo(
          "http://localhost/RegistrAgil/RegistrarInvitado/mandarMotivo.php",
          {
            anfitrion_correo: junta.anfitrion_correo,
            asunto: junta.reunion_concepto,
            motivo: motivo,
            admin: {
              nombre: "Admin Nombre",
              correo: window.localStorage.getItem("correo"),
            }
          }
        );

        if (motivoData.success) {
          console.log("Motivo enviado");
          setErrorMessage("La junta ha sido eliminada y el motivo ha sido enviado al anfitrión.");
          settituloModal("Junta Eliminada Exitosamente");
        } else {
          setErrorMessage("La junta ha sido eliminada, pero no se pudo enviar el motivo al anfitrión.");
          settituloModal("Junta Eliminada con Error en el Envío del Correo");
        }
        setShowErrorModal(true);
        // setErrorMessage("La junta ha sido eliminada exitosamente.");
        // settituloModal("Junta Eliminada Exitosamente");
        // setShowErrorModal(true);
        // setIsMainModalVisible(false);
      } else if( data.success && window.localStorage.getItem("permiso") === "4"){
        setErrorMessage("La junta ha sido eliminada exitosamente.");
        settituloModal("Junta Eliminada Exitosamente");
        setShowErrorModal(true);
        setIsMainModalVisible(false);
      } else {
        // alert("Error al eliminar la junta");
        setErrorMessage("La junta no se ha podido eliminar.");
        settituloModal("Error al Eliminar Junta");
        setShowErrorModal(true);
        setIsMainModalVisible(false);
      }
      handleClose();
      // handleShow();
      // setPeticion(prevState => !prevState);
    } catch (error) {
      // alert("Eliminación fallida: " + error);
      setErrorMessage("La junta no se ha podido eliminar.");
      settituloModal("Error al Eliminar Junta");
      setShowErrorModal(true);
      setIsMainModalVisible(false);
    }
  };

  return (
    <>
      <Button onClick={handleShow} className="btn btn-primary botonBorrar">
        <Icon.XCircle color="#a7000f" className="iconBorrar"></Icon.XCircle>
      </Button>
      

      <Modal show={show && isMainModalVisible} onHide={handleClose} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Borrar Junta</Modal.Title>
        </Modal.Header>
        <Modal.Body className="paddingBody">
          <Row>
            <Col>
              <h5 className="tituloBorrar">¿Está seguro de que desea borrar la junta?</h5>
              <h6 className="asuntoBorrar">Asunto: {junta.reunion_concepto}</h6>
            </Col>
          </Row>
          {/* //Checamos si el usuario es anfitrion o administrador */}
          {/*//Si es anfitrion, no se le pide el motivo al borrar la junta*/}
          {/*//Si es administrador, se le pide el motivo al borrar la junta */}
          {window.localStorage.getItem("permiso") === "1" ? (
            <Form className="mt-3" ref={formRef}>
              <Form.Label className="mb-1">Motivo*</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={motivo}
                onChange={handleChange}
                required
              />
            </Form>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <div className="w-100 d-flex justify-content-between">
            <Button variant="secondary" className="boton" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="danger" className="boton" onClick={handleSubmit}>
              Confirmar
            </Button>
          </div>
          
        </Modal.Footer>
      </Modal>

      {/* Modal de error */}
      <Modal show={showErrorModal} className="custom-modal" onHide={() => {setShowErrorModal(false); setIsMainModalVisible(true); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>{tituloModal}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="paddingBody">
          <p className="parrafoModal">{errorMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="boton" onClick={() => {setShowErrorModal(false); setIsMainModalVisible(true); setPeticion(prevState => !prevState);}}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );

}

export default BorrarJuntas;
