import React, { useEffect, useState, useRef} from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import {QRCodeSVG} from 'qrcode.react'; //Librerias para generar QR, se instalan con npm install qrcode.react
import {QRCodeCanvas} from 'qrcode.react';
import QRCode from 'qrcode.react'; //Hasta aqui son esas 3 librerias, se puede usar cualquiera de las 3
import domtoimage from 'dom-to-image'; //Libreria para descargar la imagen del QR, Se instala con npm install dom-to-image
import { saveAs } from 'file-saver'; //Junto con esta también para descargar la imagen del QR, Se instala con npm install file-saver
import { BarraSuperior } from "../BarraSuperiorInvitado";
import { FooterPG } from "../Footer";
import { useNavigate } from "react-router-dom";
import "../CSS/DescargarQR.css";

export default function DescargarQR() {
  const location = useLocation();
  const { state } = location;
  const [junta, setJunta] = useState(null);
  const qrCodeRef = useRef(null); //Para descargar la imagen del QR
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [tituloModal, settituloModal] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (state) {
      fetchQRData(state);
    }
  }, [state]);

  const fetchQRData = async (juntaData) => {
    const correo = window.localStorage.getItem("correo");
    const datos = {
      correo,
      correoAnfitrion: juntaData.CorreoAnfitrion,
      fecha: juntaData.Fecha,
      horaInicio: juntaData.Horario.split('-')[0],
      sala: juntaData.Sala,
    };

    try {
      const respuesta = await fetch("http://localhost/RegistrAgil/Invitado/VerQR.php", {
        method: "POST",
        body: JSON.stringify(datos),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await respuesta.json();
      console.log("respuesta obtenida: ", json);
      setJunta(json[0]);

      //Si el Codigo QR es null, se muestra un mensaje de error y se redirige a la página de inicio del invitado
      if(json[0].CodigoQR == null){
        settituloModal("Error al Obtener el QR");
        setErrorMessage("El código QR no está disponible en este momento. Intente más tarde.");
        setShowErrorModal(true);
      }else{
        // setJunta(json[0]);
        console.log("Codigo QR: ", json[0].CodigoQR);
      }
      // console.log("Codigo QR: ", junta.CodigoQR);
    } catch (error) {
      console.log("Error al obtener los datos del QR:", error);
    }
  };

  const regresarPagina = () => {
    navigate("/Invitado");
  }

  const downloadQR = () => {
    domtoimage.toBlob(qrCodeRef.current)
      .then((blob) => {
        saveAs(blob, 'codigoQR.png');
      });
  };

  return (
    <>
      <header> <BarraSuperior /> </header>
      <Container fluid className="main-container">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <h2 className="title">Datos de la Junta</h2>
            {junta ? (
              <>
                {/* <p>Nombre: {junta.Nombre}</p> */}
                <p>Fecha: {junta.Fecha}</p>
                <p>Hora de Inicio: {junta.HoraInicio}</p>
                <p>Hora de Finalización: {junta.HoraFin}</p>
                <p>Asunto: {junta.asunto}</p>
                <p>Sala: {junta.Sala}</p>
                <p>Responsable: {junta.Responsable}</p>
                <p>Fecha de Caducidad: {junta.FechaCaducida}</p>
                {/* <p>Codigo QR: {junta.CodigoQR}</p> */}
                {/* <img src={`data:image/jpeg;base64,${junta.CodigoQR}`} alt="Código QR" /><br /> */}
                {junta.CodigoQR == null ? <p>El código QR no está disponible en este momento.</p> : <>
                <div className="qr-container">
                  <div ref={qrCodeRef} className=" d-flex justify-content-center align-items-center downloadQR">
                    <QRCodeSVG value={junta.CodigoQR.toString()} />
                  </div>
                </div>
                <Button variant="primary" className="qr-buttonQR" onClick={downloadQR}>
                  Descargar QR
                </Button></>}
                {/* Las otras dos opciones para generar el QR */}
                {/* <QRCodeCanvas value={junta.codigoQR} /><br /><br />
                <QRCode value={junta.CodigoQR} renderAs="canvas" /><br /><br /> */}
              </>
            ) : (
              <p>Cargando datos de la junta...</p>
            )}
          </Col>
        </Row>
      </Container>
      <footer> <FooterPG /> </footer>

      {/* Modal de error */}
      <Modal show={showErrorModal} className="custom-modal" onHide={() => {setShowErrorModal(false); regresarPagina();}} centered>
        <Modal.Header closeButton>
          <Modal.Title>{tituloModal}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="paddingBody">
          <p className="parrafoModal">{errorMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="boton" onClick={() => {setShowErrorModal(false); regresarPagina();}}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
