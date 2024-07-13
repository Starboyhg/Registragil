import { Row, Col, Button, Form, InputGroup, Modal } from "react-bootstrap";
import React, { useState, useRef } from "react";
// import InputGroup from "react-bootstrap/InputGroup";
import * as Icon from "react-bootstrap-icons";

//Para colocar horas sin segundos se puede usar, pero me falta probarla:
// import TimePicker from 'react-time-picker';  //con npm install react-time-picker

// <div className="col">
//   <Form.Label className="input-group mb-1">Hora de Inicio*</Form.Label>
//   <TimePicker
//     id="horaInicio"
//     value={formData.horaInicio}
//     onChange={(value) => handleChange({ target: { id: 'horaInicio', value } })}
//     disableClock={true}
//     format="hh:mm a"
//   />
// </div>
// <div className="col">
//   <Form.Label className="input-group mb-1">Hora de Fin*</Form.Label>
//   <TimePicker
//     id="horaFin"
//     value={formData.horaFin}
//     onChange={(value) => handleChange({ target: { id: 'horaFin', value } })}
//     disableClock={true}
//     format="hh:mm a"
//   />
// </div>


// const MySwal = withReactContent(Swal);

async function solicitarEdicion(url, data) {
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

function EditarJuntas({ setPeticion, junta }) {

  const formRef = useRef();
  // const [invitados, setInvitados] = useState([]);
  // const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [tituloModal, settituloModal] = useState("");
  const [isMainModalVisible, setIsMainModalVisible] = useState(true);

  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    asunto: junta.reunion_concepto,
    fecha: junta.reunion_fecha,
    horaInicio: junta.reunion_horaInicio,
    horaFin: junta.reunion_horaFin,
    sala: junta.reunion_sala,
    descripcion: junta.reunion_descripcion,
  });

  const handleChange = (e) => {
    const {id, value} = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleClose = () => {
    setShow(false);
    setFormData({
      asunto: junta.reunion_concepto,
      fecha: junta.reunion_fecha,
      horaInicio: junta.reunion_horaInicio,
      horaFin: junta.reunion_horaFin,
      sala: junta.reunion_sala,
      descripcion: junta.reunion_descripcion,
    });
  }
  const handleShow = () => {
    setShow(true);
    setFormData({
      asunto: junta.reunion_concepto,
      fecha: junta.reunion_fecha,
      horaInicio: junta.reunion_horaInicio,
      horaFin: junta.reunion_horaFin,
      sala: junta.reunion_sala,
      descripcion: junta.reunion_descripcion,
    });
  }

  const handleSubmit = async () => {
    event.preventDefault();
    if(formRef.current.reportValidity() === false){
      event.stopPropagation();
    }else{
      try {
        const data = await solicitarEdicion(
          "http://localhost/RegistrAgil/GestionarJuntas/Editar_Juntas.php",
          {
            descripcion: formData.descripcion,
            hora_inicio: formData.horaInicio,
            hora_inicio_Actual: junta.reunion_horaInicio,
            hora_fin: formData.horaFin,
            fecha: formData.fecha,
            fecha_Actual: junta.reunion_fecha,
            sala: formData.sala,
            sala_Actual: junta.reunion_sala,
            correo: junta.anfitrion_correo,
            asunto: formData.asunto,
          }
        );

        if (data.success) {
          setPeticion(false);
          // alert("Edición correcta: " + data.message);
          setErrorMessage("La junta se ha editado correctamente.");
          settituloModal("Junta Editada Exitosamente");
          setShowErrorModal(true);
          setIsMainModalVisible(false);
        } else {
          // alert("Error al actualizar la junta");
          setErrorMessage("La junta no se ha podido editar. Intente de nuevo más tarde.");
          settituloModal("Error al Editar la Junta");
          setShowErrorModal(true);
          setIsMainModalVisible(false);
        }
        handleClose();
      } catch (error) {
        // alert("Edición fallida: " + error);
        setErrorMessage("La junta no se ha podido editar. Intente de nuevo más tarde.");
        settituloModal("Error al Editar la Junta");
        setShowErrorModal(true);
        setIsMainModalVisible(false);
      }
    }
  };

  return (
    <>
      <Button onClick={handleShow} className="btn btn-primary botonListInv">
        <Icon.PencilSquare className="iconBorrar" onClick={handleShow}></Icon.PencilSquare>
      </Button>
      
      <Modal show={show && isMainModalVisible} onHide={handleClose} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Editar Junta</Modal.Title>
        </Modal.Header>
        {/*className="paddingBody"*/}
        <Modal.Body className="paddingBody">
          <Form ref={formRef}>
            <div className="mb-3 row">
              <div className="col">
                <Form.Label className="input-group mb-1">Asunto*</Form.Label>
                <Form.Control id="asunto" value={formData.asunto} onChange={handleChange} required/>
              </div>
            </div>
            <div className="mb-3 row">
              <div className="col">
                <Form.Label className="input-group mb-1">Fecha*</Form.Label>
                <Form.Control type="date" id="fecha" value={formData.fecha} onChange={handleChange} required/>
              </div>
            </div>
            <div className="row">
              <div className="col mb-3">
                <Form.Label className="input-group mb-1">Hora de Inicio*</Form.Label>
                <Form.Control type="time" id="horaInicio" value={formData.horaInicio} onChange={handleChange} required/>
              </div>
              <div className="col mb-3">
                <Form.Label className="input-group mb-1">Hora de Fin*</Form.Label>
                <Form.Control type="time" id="horaFin" value={formData.horaFin} onChange={handleChange} required/>
              </div>
            </div>
            <div className="mb-3 row">
              <div className="col">
                <Form.Label className="input-group mb-1">Sala*</Form.Label>
                <Form.Control id="sala" value={formData.sala} onChange={handleChange} required/>
              </div>
            </div>
            <div className="mb-3 row">
              <div className="col">
                <Form.Label className="input-group mb-1">Descripción*</Form.Label>
                <Form.Control id="descripcion" as="textarea" value={formData.descripcion} onChange={handleChange} required/>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className="w-100 d-flex justify-content-between">
            <Button variant="secondary" className="boton" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" className="boton" onClick={handleSubmit}>
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
          {/* Lo comentado es para hacer que al dar clic en aceptar, se vuelva a mostrar el modal de editar, pero eso queda a gusto del cliente */}
          <Button variant="secondary" className="boton" onClick={() => {setShowErrorModal(false); setIsMainModalVisible(true); /*handleShow();*/}}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
  
}

export default EditarJuntas;
