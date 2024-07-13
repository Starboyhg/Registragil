import * as Icon from "react-bootstrap-icons";
import { Form, Table, Button, Modal, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../CSS/VerInvitados.css";
import Agregar from "../imgs/agregar.png";

function VerInvitados({ junta }) {
  const [invitados, setInvitados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [acompanantes, setAcompanantes] = useState("0");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [tituloModal, settituloModal] = useState("");
  const [isMainModalVisible, setIsMainModalVisible] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingCorreo, setEditingCorreo] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [correoAnterior, setCorreoAnterior] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const permisos = window.localStorage.getItem("permisos");
    setIsAdmin(permisos === "1");
  }, []);

  const cargarInvitados = async () => {
    const response = await fetch("http://localhost/RegistrAgil/GestionarJuntas/Visualizar_Invitados_Junta.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hora_inicio: junta.horaInicio,
        fecha: junta.fecha,
        sala: junta.sala,
        correo: junta.correo,
      }),
    });
    const data = await response.json();
    if (data.invitados) {
      // console.log("Invitados obtenidos:", data.invitados, "para la junta:", junta);
      setInvitados(data.invitados);
      setShowModal(true);
      setIsMainModalVisible(true);
    } else {
      console.error("Error al obtener los invitados:", data.message);
    }
  };

  const handleEditClick = (correo, index) => {
    if (window.localStorage.getItem("permiso") === "1"){
      if (invitados[index].invitado_nombre === null) {
        console.log("Administrador editando correo local:", correo, "en la posición:", index);
        setEditingCorreo(correo);
        setCorreoAnterior(correo);
        setEditingIndex(index);
      } else {
        navigate('/Administrador/GestionarInvitados', { state: { 
          correo, 
          hora_inicio: junta.horaInicio,
          fecha: junta.fecha,
          sala: junta.sala, } });
      }
      
    } else {
      //Solo permitimos editar correos de invitados sin confirmar
      if (invitados[index].invitado_nombre === null) {
        console.log("Anfitrion editando correo:", correo, "en la posición:", index);
        setEditingCorreo(correo);
        setCorreoAnterior(correo);
        setEditingIndex(index);
        //modals de confirmación
        // settituloModal("Correo Editado Exitosamente");
        // setErrorMessage("El correo ha sido editado exitosamente.");
        // setShowErrorModal(true);
        // setIsMainModalVisible(false);
      } else {
        setErrorMessage("Solo se pueden editar correos de invitados sin confirmar.");
        settituloModal("Error de Edición");
        setShowErrorModal(true);
        setIsMainModalVisible(false);
      }
    }
  };

    // const saveEditedCorreo = async () => {
    //   // Update the correo in the backend and update state accordingly
    //   // Example update logic
    //   const updatedInvitados = [...invitados];
    //   updatedInvitados[editingIndex].invitado_correo = editingCorreo;
    //   setInvitados(updatedInvitados);
    //   setEditingCorreo("");
    //   setEditingIndex(null);
    // };

    const saveEditedCorreo = async () => {
      try {
        console.log("Enviando correo anterior:", correoAnterior, "y nuevo correo:", editingCorreo, "para la junta:", junta);
        const response = await fetch("http://localhost/RegistrAgil/GestionarInvitados/cambiarCorreo.php", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correo: correoAnterior,
            nuevoCorreo: editingCorreo,
          }),
        });
        const data = await response.json();
        console.log("Data después de editar correo como anfitrión:", data);
        if (data.success == true) {
          const updatedInvitados = [...invitados];
          updatedInvitados[editingIndex].invitado_correo = editingCorreo;
          setInvitados(updatedInvitados);
          setEditingCorreo("");
          setEditingIndex(null);
          enviarCorreo([editingCorreo]);
          setErrorMessage("El correo ha sido editado exitosamente y se ha enviado la invitación a la nueva dirección de correo.");
          settituloModal("Correo Editado Exitosamente");
          setShowErrorModal(true);
          setIsMainModalVisible(false);
        } else {
          setErrorMessage(data.error);
          settituloModal("Error al Editar Correo");
          setShowErrorModal(true);
          setIsMainModalVisible(false);
        }
      } catch (error) {
        console.error("Error al guardar el correo editado:", error);
        setErrorMessage("Hubo un error al intentar actualizar el correo.");
        settituloModal("Error al Editar Correo");
        setShowErrorModal(true);
        setIsMainModalVisible(false);
      }
    };

    const agregarInvitado = async () => {
      if (!nuevoCorreo || !/\S+@\S+\.\S+/.test(nuevoCorreo)) {
        setErrorMessage('Por favor, ingrese un correo electrónico válido.');
        settituloModal("Correo Electrónico Incorrecto");
        setShowErrorModal(true);
        setIsMainModalVisible(false);
        return;
      }

      //Checamos que el invitado no exista ya en la lista de invitados de la junta
      for (let i = 0; i < invitados.length; i++) {
        if (invitados[i].invitado_correo === nuevoCorreo) {
          setErrorMessage('El invitado ya se encuentra en la lista de invitados.');
          settituloModal("Invitado Existente");
          setShowErrorModal(true);
          setIsMainModalVisible(false);
          return;
        }
      }

      console.log(`Agregando invitado: ${nuevoCorreo} con ${acompanantes} acompañantes.`);
      //Limpiar los campos llenados
      setNuevoCorreo("");
      setAcompanantes("0");
  
      const response = await fetch("http://localhost/RegistrAgil/GestionarJuntas/Agregar_Invitado.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hora_inicio: junta.horaInicio,
          fecha: junta.fecha,
          sala: junta.sala,
          correo_anfitrion: junta.correo,
          correo_invitado: nuevoCorreo,
          acompanantes: acompanantes,
        }),
      });
  
      const data = await response.json();
      if (data.Ligada == true) {
        setErrorMessage("El invitado ha sido agregado con éxito y se ha enviado la invitación por correo.");
        settituloModal("Agregar Invitado Exitosamente");
        setShowErrorModal(true);
        setIsMainModalVisible(false);

        //Enviamos el correo al invitado
        enviarCorreo([nuevoCorreo]);
        
        //actualizamos la lista de invitados
        const response = await fetch("http://localhost/RegistrAgil/GestionarJuntas/Visualizar_Invitados_Junta.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hora_inicio: junta.horaInicio,
            fecha: junta.fecha,
            sala: junta.sala,
            correo: junta.correo,
          }),
        });
        const data = await response.json();
        if (data.invitados) {
          // console.log("Invitados obtenidos:", data.invitados, "para la junta:", junta);
          setInvitados(data.invitados);
        } else {
          console.error("Error al obtener los invitados:", data.message);
        }
      } else {
        // console.log("Error al agregar el invitado");
        // console.log(data.Ligada);
        setErrorMessage("Error al agregar el invitado");
        settituloModal("Error al Agregar el Invitado");
        setShowErrorModal(true);
        setIsMainModalVisible(false);
      }
    };

    const reenviarCorreo = (correo) => {
      console.log(`Reenviar correo a: ${correo}`);
      enviarCorreo([correo]);
      setErrorMessage("El correo ha sido reenviado exitosamente a la dirección de correo electrónico: " + correo);
      settituloModal("Correo Reenviado Exitosamente");
      setShowErrorModal(true);
      setIsMainModalVisible(false);
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
          hora_inicio: junta.horaInicio,
          fecha: junta.fecha,
          sala: junta.sala,
          descripcion: junta.descripcion,
          correo_anfitrion: junta.correo,
          direccion: junta.ubicacion,
        }),
      });
  
      const data = await response.json();
      if (data.success) {
        console.log(`Correo enviado a ${correos}`);
        // setErrorMessage("El correo ha sido reenviado exitosamente a la dirección de correo electrónico: " + correos);
        // settituloModal("Correo Reenviado Exitosamente");
        // setShowErrorModal(true);
        // setIsMainModalVisible(false);
      } else {
        console.error(`Error al enviar correo: ${data.message}`);
        setErrorMessage(`Error al enviar correo: ${data.message}`);
        settituloModal("Error al Enviar Correo");
        setShowErrorModal(true);
        setIsMainModalVisible(false);
      }
    };

    return (
      <>
          <Button onClick={cargarInvitados} className="btn btn-primary botonListInv">
            <Icon.PersonLinesFill className="iconListInv" />
          </Button>
          
        {/* Modal Principal */}
        <Modal show={showModal && isMainModalVisible} onHide={() => setShowModal(false)} className="custom-modal" size="lg" onExit={() => {setNuevoCorreo(""); setAcompanantes("0");}}>
          <Modal.Header closeButton>
            <Modal.Title>Lista de Invitados</Modal.Title>
          </Modal.Header>
          <Modal.Body className="paddingBody">
            <h5 className="tituloJunta">{junta.asunto}</h5>
            <div className="header-box">
              <Table responsive className="my-0">
                <thead>
                  <tr>
                    <th className="table-col1">Nombre</th>
                    <th className="table-col2">Correo</th>
                    <th className="table-col-small">Reenviar</th>
                  </tr>
                </thead>
              </Table>
            </div>
            <div className="content-box">
              <Table responsive className="my-0 table-responsive">
                <tbody>
                  {invitados.map((invitado, index) => (
                    <tr key={index}>
                      <td className="table-col1">
                        <Form.Check id={"checkbox" + index} reverse checked={invitado.invitado_nombre ? true : false} /> {invitado.invitado_nombre ? <div>{invitado.invitado_nombre}</div> : <div>Por Confirmar</div>}
                      </td>
                      <td className="table-col2">
                        {editingIndex === index ? (
                          <Form.Control
                            type="email"
                            value={editingCorreo}
                            onChange={(e) => setEditingCorreo(e.target.value)}
                            onBlur={saveEditedCorreo}
                            onKeyPress={(event) => {
                              if (event.key === "Enter") {
                                saveEditedCorreo();
                              }
                            }}
                          />
                        ) : (
                          <>
                            {invitado.invitado_correo} <Button className="icon-button sombraBtn" onClick={() => handleEditClick(invitado.invitado_correo, index)}>
                              <Icon.PencilFill />
                            </Button>
                          </>
                        )}
                      </td>
                      <td className="table-col-small">
                        <Button className="icon-button sombraBtn" onClick={() => reenviarCorreo(invitado.invitado_correo)}><Icon.EnvelopeAtFill size={20} /></Button>
                        {/* ArrowRepeat */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* Linea horizontal divisora */}
            <hr className="lineaDivisora" />

            <h6 className="tituloNewInv">Agregar Nuevo Invitado</h6>

            <Form>
              <div className="input-group">
                <div className="campCorreo">
                  <Form.Label className="mb-1">Correo electrónico*</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="nombre@ejemplo.com"
                    value={nuevoCorreo}
                    onChange={(e) => setNuevoCorreo(e.target.value)}
                    required
                  />
                </div>
                <div className="campAcom">
                  <Form.Label className="mb-1">No. de acompañantes</Form.Label>
                  <Form.Control as="select" value={acompanantes} onChange={(e) => setAcompanantes(e.target.value)}>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </Form.Control>
                </div>
                <div className="campBoton">
                  <Button className="tamBoton" type="button" onClick={agregarInvitado}>
                    <Image src={Agregar} alt="Agregar" className="imagenAgregar" />
                    {/* <Icon.PlusCircleFill size={20} /> */}
                  </Button>
                </div>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button className="boton" variant="secondary" onClick={() => setShowModal(false)}>
              Aceptar
            </Button>
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
          <Button variant="secondary" className="boton" onClick={() => {setShowErrorModal(false); setIsMainModalVisible(true);}}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
      </>
    );
}

export default VerInvitados;
