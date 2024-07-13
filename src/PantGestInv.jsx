import { Container, Row, Col, Image, Form, Button, Modal } from "react-bootstrap";
import "./PantGestInv.css";
import PerfilD from "./imgs/user.png";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function PantGesInvi() {
  const [edicionHabilitadaGesInv, setEdicionHabilitaGesInv] = useState(false);
  const [correo, setCorreo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [telefono, setTelefono] = useState("");
  // const [equipoModelo, setEquipoModelo] = useState("");
  // const [equipoNoSerie, setEquipoNoSerie] = useState("");
  const [equipos, setEquipos] = useState([]);
  const [cocheModelo, setCocheModelo] = useState("");
  const [cochePlaca, setCochePlaca] = useState("");
  const [cocheColor, setCocheColor] = useState("");
  const [fotografia, setFotografia] = useState("");
  const [invi, SetInvi] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  //Lista de acompañantes
  const [acompanantes, setAcompanantes] = useState([]);
  //Modals
  // const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [tituloModal, settituloModal] = useState("");
  // const [isMainModalVisible, setIsMainModalVisible] = useState(true);
  const [isTelefonoValid, setIsTelefonoValid] = useState(true);

  const [horaInicio, setHoraInicio] = useState("");
  const [fecha, setFecha] = useState("");
  const [sala, setSala] = useState("");

  const handleTelefonoChange = (e) => {
    const value = e.target.value;
    setTelefono(value);

    const phoneRegex = /^[0-9]{10}$/;
    setIsTelefonoValid(phoneRegex.test(value));
  };

  useEffect(() => {
    const { correo } = location.state || {};
    const {hora_inicio} = location.state || {};
    const {fecha} = location.state || {};
    const {sala} = location.state || {};

    console.log("Datos recuperados de la pantalla anterior:" + correo + " " + hora_inicio + " " + fecha + " " + sala);

    if (correo) {
      setCorreo(correo);
      if (hora_inicio) {
        setHoraInicio(hora_inicio);
        if (fecha) {
          setFecha(fecha);
          if (sala) {
            setSala(sala);
            cargarDatosInvitado(correo, hora_inicio, fecha, sala);
          } else{
            console.error("Sala no proporcionada");
            navigate(-1); // Regresa a la pantalla anterior si
          }
        } else{
          console.error("Fecha no proporcionada");
          navigate(-1); // Regresa a la pantalla anterior si no hay fecha
        }
      } else {
        console.error("Hora no proporcionada");
        navigate(-1); // Regresa a la pantalla anterior si no hay hora
      }
      
    } else {
      console.error("Correo no proporcionado");
      navigate(-1); // Regresa a la pantalla anterior si no hay correo
    }

    

    

    

  }, [location.state, navigate]);

  const cargarDatosInvitado = async (correo, horaInicio, fecha, sala) => {

    console.log("datos a enviar: " + correo + " " + horaInicio + " " + fecha + " " + sala);
    const response = await fetch(
      "http://localhost/RegistrAgil/GestionarInvitados/VisualizarInvitados.php",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo: correo, hora_inicio: horaInicio, fecha: fecha, sala: sala}),
      }
    );
    const json = await response.json();
    if (json.invitado === null) {
      console.error(json.error);
    } else {
      SetInvi(json.invitado);
      // console.log(invi.acompañante);
      console.log(json.invitado);
      setEmpresa(json.invitado.usuario.empresa);
      setTelefono(json.invitado.usuario.telefono);
      setFotografia(json.invitado.usuario.fotografia);
      if(json.invitado.acompañante === null){
        console.log("No hay acompañantes");
        setAcompanantes([]);
      }else{
        console.log(json.invitado.acompañante);
        setAcompanantes(json.invitado.acompañante);
      }

      if(json.invitado.equipo === null){
        console.log("No hay equipo");
        setEquipos([]);
      }else{
        console.log(json.invitado.equipo);
        setEquipos(json.invitado.equipo);
      }
      
      if(json.invitado.vehiculo === null){
        console.log("No hay vehiculo");
        setCocheModelo("");
        setCochePlaca("");
        setCocheColor("");
      }else{
        console.log(json.invitado.vehiculo);
        setCocheModelo(json.invitado.vehiculo.modelo);
        setCochePlaca(json.invitado.vehiculo.placa);
        setCocheColor(json.invitado.vehiculo.color);
      }
    }
  };

  const habilitarEdicionGesInv = () => {
    setEdicionHabilitaGesInv(true);
  };

  const cancelarEdicion = () => {
    navigate(-1); // Regresa a la pantalla anterior
  };

  const editarInvitado = async () => {
    const numDisp = equipos.length;
    const response = await fetch(
      "http://localhost/RegistrAgil/GestionarInvitados/modificar_invitado.php",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo,
          nueva_empresa: empresa,
          nuevo_telefono: telefono,
          nuevos_equipos: equipos,
          // nuevo_equipo_modelo: equipoModelo,
          // nuevo_equipo_serie: equipoNoSerie,
          nuevo_coche_modelo: cocheModelo,
          nuevo_coche_placa: cochePlaca,
          nuevo_coche_color: cocheColor,
          fecha,
          horaInicio,
          sala,
          fotografia
        }),
      }
    );
    const json = await response.json();
    console.log(json);
    if (json.error) {
      console.error(json.error);
      //Modal de error
      settituloModal("Error al editar invitado");
      setErrorMessage("Hubo un error al editar el invitado. Intente de nuevo.");
      setShowErrorModal(true);
    } else {
      //Modal de confirmación
      settituloModal("Edición exitosa");
      setErrorMessage("El invitado ha sido editado correctamente.");
      setShowErrorModal(true);
      // console.log("Invitado editado correctamente.");
    }
  };

  const confirmarEdicion = async () => {
    await editarInvitado();

    setEdicionHabilitaGesInv(false);
  };

  if (!invi) {
    return <p>Cargando...</p>;
  }

  return (
    <Container className="main-container d-flex justify-content-center">
      <div className="ContenedorGesInv">
        <h3 className="mt-3">Editar Invitado</h3>
        <form>
          <div className="ContDaPer">
            <div className="ContenedorDatosPer">
              <div className="col-75">
                <div className="ContNombre">
                  <div>
                    <label>Nombre(s)</label>
                    <br />
                    <input
                      defaultValue={invi.usuario.nombre}
                      type="text"
                      className="InputNombre"
                      disabled
                    />
                  </div>
                  <div>
                    <label>Apellido Paterno</label>
                    <br />
                    <input
                      defaultValue={invi.usuario.apellido_paterno}
                      type="text"
                      className="InputNombre"
                      disabled
                    />
                  </div>
                  <div>
                    <label>Apellido Materno</label>
                    <br />
                    <input
                      defaultValue={invi.usuario.apellido_materno}
                      type="text"
                      className="InputNombre"
                      disabled
                    />
                  </div>
                </div>
                <div className="ContEmpID">
                  <div>
                    <label>Empresa Proveniente</label>
                    <br />
                    <input
                      value={empresa}
                      // defaultValue={invi.usuario.empresa}
                      onChange={(e) => setEmpresa(e.target.value)}
                      type="text"                      
                      disabled={!edicionHabilitadaGesInv}                    
                      className={empresa.trim() !== "" ? "InputEmpID" : "InputEmpID invalid"} 
                    />
                    <div className="error-message">
                      {empresa.trim() !== "" ? null : <span className="error-empresa">Por favor ingresa una empresa.</span>}
                    </div>
                  </div>
                  <div>
                    <label>Identificación Presentada</label>
                    <br />
                    <input
                      defaultValue={invi.identificacion}
                      type="text"
                      className="InputEmpID"
                      disabled
                    />
                  </div>
                </div>
                <div className="ContContacto">
                  <div>
                    <label>Correo Electrónico</label>
                    <br />
                    <input
                      defaultValue={correo}
                      type="email"
                      className="InputCorreo"
                      // disabled={!edicionHabilitadaGesInv}
                      disabled
                    />
                  </div>
                  <div>
                    <label>Teléfono</label>
                    <br />
                    <input
                      value={telefono}
                      // defaultValue={invi.usuario.telefono}
                      onChange={handleTelefonoChange}
                      type="tel"
                      disabled={!edicionHabilitadaGesInv}
                      className={isTelefonoValid ? "InputTelefono" : "InputTelefono invalid"}
                    />
                    <div className="error-message">
                      {isTelefonoValid ? null : <span className="error-telefono">Por favor ingresa un número de teléfono válido.</span>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-25">
              <p className="mb-0">Fotografía</p>
              <img src={fotografia ? `data:image/jpeg;base64,${fotografia}` : PerfilD} alt="Fotografia" className="Fotografia card-foto" />
              </div>
            </div>
          </div>
          {/* <div className="ContEncabezadosInfoExtra">
            <div className="Col-33Enc">
              <h5>Dispositivo(s)</h5>
            </div>
            <div className="Col-33Enc">
              <h5>Automóvil</h5>
            </div>
            <div className="Col-33Enc">
              <h5>Acompañantes</h5>
            </div>
          </div> */}
          <div className="ContInfoEx">
            <div className="ContenedorInfoExtra">
              
              {equipos.length === 0 ? null : <div className={`col-33 ${(acompanantes.length > 0 && cocheModelo === "" && equipos.length > 0) || (acompanantes.length === 0 && cocheModelo !== "" && equipos.length > 0) ? "RE11" : "RE1"}`}>
                  <h5 className="EncabezadoInv">Dispositivo(s)</h5>
                  <div className="ContenedorDis">
                      {/* mapeamos todos los equipos que tenga el invitado */}
                      {equipos.map((equipo, index) => (<><div className="FormGroup" >
                          <label className="LabelInfoExtra">Modelo</label>
                          <input
                            value={equipo.modelo}
                            // defaultValue={invi.equipo.modelo}
                            // onChange={(e) => setEquipoModelo(e.target.value)}
                            //Agregamos el cambio de estado para cada equipo
                            onChange={(e) => {
                              const newEquipos = [...equipos];
                              newEquipos[index].modelo = e.target.value;
                              setEquipos(newEquipos);
                            }}
                            type="text"
                            /* className="InputInfoExtra" */
                            disabled={!edicionHabilitadaGesInv}
                            className={(equipo.modelo).trim() !== "" ? "InputInfoExtra" : "InputInfoExtra invalid"}
                          />
                          <div className="error-modelo">
                            {(equipo.modelo).trim() !== "" ? null : <span className="error-modelo">Por favor ingresa un modelo.</span>}
                          </div>
                          </div>
                          <div className="FormGroup" >
                            <label className="LabelInfoExtra">Número de Serie</label>
                            <input
                              value={equipo.NoSerie}
                              // onChange={(e) => setEquipoNoSerie(e.target.value)}
                              // //Agregamos el cambio de estado para cada equipo
                              // onChange={(e) => {
                              //   const newEquipos = [...equipos];
                              //   newEquipos[index].NoSerie = e.target.value;
                              //   setEquipos(newEquipos);
                              // }}
                              // defaultValue={invi.equipo.NoSerie}
                              type="text"
                              /* className="InputInfoExtra" */
                              // disabled={!edicionHabilitadaGesInv}
                              disabled
                              // className={(equipo.NoSerie).trim() !== "" ? "InputInfoExtra" : "InputInfoExtra invalid"}
                              className="InputInfoExtra"
                            />
                            <div className="error-numS"> 
                              {(equipo.NoSerie).trim() !== "" ? null : <span className="error-numS">Por favor ingresa un número de serie.</span>}
                            </div>
                          </div>
                        </>
                        ))}
                  </div>
                </div>
              }
              
              {cocheModelo === "" ? null : <div className={`col-33 ${(acompanantes.length > 0 && equipos.length === 0 && cocheModelo !== "") || (acompanantes.length === 0 && equipos.length > 0 && cocheModelo !== "") ? "RE22" : "RE2"}`}>
                  <h5 className="EncabezadoInv">Automóvil</h5>
                  <div className="ContenedorAuto">
                    <div className="FormGroup">
                      <label className="LabelInfoExtra">Modelo</label>
                      <input
                        value={cocheModelo}
                        onChange={(e) => setCocheModelo(e.target.value)}
                        // defaultValue={invi.vehiculo.modelo}
                        type="text"
                        /* className="InputInfoExtra" */
                        disabled={!edicionHabilitadaGesInv}
                        className={cocheModelo.trim() !== "" ? "InputInfoExtra" : "InputInfoExtra invalid"}
                      />
                      <div className="error-cmodelo">
                        {cocheModelo.trim() !== "" ? null : <span className="error-cmodelo">Por favor ingresa un modelo.</span>}
                      </div>
                    </div>
                    <div className="FormGroup">
                      <label className="LabelInfoExtra">Placa</label>
                      <input
                        value={cochePlaca}
                        onChange={(e) => setCochePlaca(e.target.value)}
                        // defaultValue={invi.vehiculo.placa}
                        type="text"
                        /* className="InputInfoExtra" */
                        disabled={!edicionHabilitadaGesInv}
                        className={cochePlaca.trim() !== "" ? "InputInfoExtra" : "InputInfoExtra invalid"}
                      />
                      <div className="error-cplaca">
                        {cochePlaca.trim() !== "" ? null : <span className="error-cplaca">Por favor ingresa una placa.</span>}
                      </div>
                    </div>
                    <div className="FormGroup">
                      <label className="LabelInfoExtra">Color</label>
                      <input
                        value={cocheColor}
                        onChange={(e) => setCocheColor(e.target.value)}
                        // defaultValue={invi.vehiculo.color}
                        type="text"
                        /* className="InputInfoExtra" */
                        disabled={!edicionHabilitadaGesInv}
                        className={cocheColor.trim() !== "" ? "InputInfoExtra" : "InputInfoExtra invalid"}
                      />
                      <div className="error-ccolor">
                        {cocheColor.trim() !== "" ? null : <span className="error-ccolor">Por favor ingresa un color.</span>}
                      </div>
                    </div>
                  </div>
                </div>
              }
              {acompanantes.length === 0 ? null : <div className={`col-33 ${(cocheModelo !== "" && equipos.length === 0 && acompanantes.length > 0) || (cocheModelo === "" && equipos.length > 0 && acompanantes.length > 0) ? "RE33" : "RE3"}`}>
                  <h5 className="EncabezadoInv">Acompañantes</h5>
                  <div className="ContenedorAcom">
                    {/* mapeamos todos los acompañantes que tenga el invitado */}
                    {acompanantes.length > 0
                      ? acompanantes.map((acompanante, index) => (
                          <div key={index} className="FormGroup">
                            <label className="LabelInfoExtra">
                              Acompañante {index + 1}
                            </label>
                            <input
                              defaultValue={
                                acompanante.nombre +
                                " " +
                                acompanante.apellido_paterno +
                                " " +
                                acompanante.apellido_materno
                              }
                              type="text"
                              className="InputInfoExtra"
                              // disabled={!edicionHabilitadaGesInv}
                              disabled
                            />
                            {/* Imprimimos correo */}
                            <label className="LabelInfoExtra">Correo</label>
                            <input
                              defaultValue={acompanante.correo}
                              type="email"
                              className="InputInfoExtra"
                              // disabled={!edicionHabilitadaGesInv}
                              disabled
                            />
                          </div>
                        ))
                      : "No hay Acompañantes"}
                  </div>
                </div>
              }
            </div>
          </div>
          
          <div>
            <button
              type="button"
              className="btnBI izq Espacio boton"
              onClick={cancelarEdicion}
            >
              Cancelar
            </button>
          </div>
          <div className="">
            <button
              type="button"
              className="btnBI der Espacio boton"
              onClick={habilitarEdicionGesInv}
              style={{ display: edicionHabilitadaGesInv ? "none" : "flex" }}
            >
              Editar
            </button>
            <button
              type="button"
              className="btnBI der Espacio boton"
              onClick={() => {confirmarEdicion();}}
              style={{ display: edicionHabilitadaGesInv ? "flex" : "none" }}
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>

      {/* Modal de error */}
      <Modal show={showErrorModal} className="custom-modal" onHide={() => {setShowErrorModal(false);}} centered>
        <Modal.Header closeButton>
          <Modal.Title>{tituloModal}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="paddingBody">
          <p className="parrafoModal">{errorMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          {/* Al botón le colocamos el navigate para regresar a la anterior pantalla */}
          <Button variant="secondary" className="boton" onClick={() => {setShowErrorModal(false); navigate(-1);}}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
    
  );
}

export default PantGesInvi;
