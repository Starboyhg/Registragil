import Logo from "./imgs/Logo.jpg";
import "./ConPag.css";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Container } from "react-bootstrap";

export function ConPag() {
  const [datosU, setDatosU] = useState([]);
  const [error, setError] = useState(null);
  const [mostrarModalViES, setMostrarModalViES] = useState(null);

  const fechaHoy = new Date();

  const formatearFecha = (fecha) => {
    const opciones = { year: "numeric", month: "long", day: "numeric" };
    return fecha.toLocaleDateString("es-ES", opciones);
  };

  const formatearFechaCons = (fecha) => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0"); // Los meses empiezan en 0
    const day = String(fecha.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const MostEntrSal = async () => {
    console.log("Cargando datos");

    try {
      const respuesta = await fetch(
        "http://localhost/RegistrAgil/VisualizarEntrSal/VisualizarEntraSaliConModal.php",
        {
          method: "POST",
          body: JSON.stringify({ Fecha: formatearFechaCons(fechaHoy) }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!respuesta.ok) {
        console.log("Entrando a if OK");
        const errorResponse = await respuesta.json();
        throw new Error(errorResponse.message || "Error desconocido");
      }

      const json = await respuesta.json();
      console.log("respuesta obtenida", json);

      if (json.success) {
        setDatosU(json.dataArray);
      } else {
        console.log("No existen datos para visualizar");
        setError(json.message || "No existen datos para visualizar");
      }
    } catch (error) {
      console.error("Error al cargar entradas y salidas", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    MostEntrSal();
  }, []);

  /* const [mostrarModalViES, setMostrarModalViES] = useState(false); */
  const ModalViESCerrar = () => setMostrarModalViES(null);

  /* const ModalViESCerrar = () => setMostrarModalViES(false); */
  const ModalViESAbrir = () => setMostrarModalViES(true);

  return (
    <>
      <Container className="">
        <div className="ContPrin">
          <h3 className="EncabezadoPrin">Visualizar Entrada/Salida</h3>
          <h4 className="EncabezadoPrinHora">{formatearFecha(fechaHoy)}</h4>
          <div className="ContenedorEncabezados">
            <div>
              <h4 className="EncabezadoHr">Invitado</h4>
            </div>
            <div>
              <h4 className="EncabezadoHr">Hora de Entrada</h4>
            </div>
            <div>
              <h4 className="EncabezadoHr">Hora de Salida</h4>
            </div>
          </div>
          <div className="Contenedor">
            {datosU.length === 0 ? (
              <div className="NoEntradas">
                <p className="parrafoMensaje">Ningún invitado ha registrado su entrada durante el día de hoy</p>
              </div>
            ) : (datosU.map((item, index) => (
              <div className="ContenedorViEntrSal" key={index}>
                <div className="CartaConFoto">
                  <div className="col-50-foto" style={{display: 'flex'}}>
                    <img
                      src={`data:image/jpeg;base64, ` + item.Fotografia}
                      alt={`Foto de Perfil ${index}`}
                      className="FotoPerfil Usuario mb-4 "
                      style={{width: '100%', height: 'auto', maxWidth: '180px', objectFit: 'cover'}}
                      /* onClick={ModalViESAbrir} */
                      onClick={() => setMostrarModalViES(index)}
                    />
                  </div>

                  <Modal
                    show={mostrarModalViES === index}
                    onHide={ModalViESCerrar}
                    centered
                    className="custom-modal"
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Invitado</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{backgroundColor: '#F0F8FF', borderRadius: '10px'}}>
                      <div className="ContenedorModalViES">
                        {/* <p className="EncabezadoModalViES">Invitado</p> */}
                        <div className="ContenedorDatosViES">
                          <div className="ContenedorImagenModal">
                            <img
                              src={
                                `data:image/jpeg;base64, ` +
                                datosU[mostrarModalViES]?.Fotografia
                              }
                              alt="Foto de Perfil"
                              className="FotoPerfil"
                            />
                            <p className="NombreInvModal">
                              {datosU[mostrarModalViES]?.Nombre}
                            </p>
                          </div>
                          <div className="ContenedorInputViES">
                            <div className="Col-25ViES">
                              <label className="ModalLabelViES">Teléfono</label>
                            </div>
                            <div className="Col-75ViES">
                              <input
                                type="tel"
                                id={`TelefonoInv_${index}`}
                                name={`TelefonoInv_${index}`}
                                className="InputsModalViES"
                                disabled
                                value={datosU[mostrarModalViES]?.Telefono}
                              />
                            </div>
                          </div>
                          <div className="ContenedorInputViES">
                            <div className="Col-25ViES">
                              <label className="ModalLabelViES">Correo</label>
                            </div>
                            <div className="Col-75ViES">
                              <input
                                type="email"
                                id={`EmailInv_${index}`}
                                name={`EmailInv_${index}`}
                                className="InputsModalViES"
                                disabled
                                value={datosU[mostrarModalViES]?.Email}
                              />
                            </div>
                          </div>
                          <div className="ContenedorInputViES">
                            <div className="Col-25ViEs">
                              <label className="ModalLabelViES">
                                Dispositivo
                              </label>
                            </div>
                            <div className="Col-75ViES">
                              {datosU[mostrarModalViES]?.ModeloDispositivo &&
                                datosU[
                                  mostrarModalViES
                                ]?.ModeloDispositivo.split(",").map(
                                  (modelo, i) => (
                                    <div key={i}>
                                      <input
                                        type="text"
                                        id={`ModeloDispositivoInv_${mostrarModalViES}_${i}`}
                                        name={`ModeloDispositivoInv_${mostrarModalViES}_${i}`}
                                        className="InputsModalViES"
                                        disabled
                                        value={modelo}
                                      />
                                      <br />
                                      {datosU[mostrarModalViES]
                                        ?.NoSerieDispositivo &&
                                        datosU[
                                          mostrarModalViES
                                        ]?.NoSerieDispositivo.split(",").map(
                                          (serie, j) =>
                                            i === j && (
                                              <input
                                                key={j}
                                                type="text"
                                                id={`NoSerieDispositivoInv_${mostrarModalViES}_${j}`}
                                                name={`NoSerieDispositivoInv_${mostrarModalViES}_${j}`}
                                                className="InputsModalViES"
                                                disabled
                                                value={serie}
                                                style={{
                                                  marginTop: "15px",
                                                  marginBottom: "15px",
                                                }}
                                              />
                                            )
                                        )}
                                    </div>
                                  )
                                )}
                            </div>
                          </div>
                          <div className="ContenedorInputViES">
                            <div className="Col-25ViES">
                              <label className="ModalLabelViES">
                                Automovil
                              </label>
                            </div>
                            <div className="Col-75ViES">
                              <input
                                type="text"
                                id={`ModeloAutoInv_${index}`}
                                name={`ModeloAutoInv_${index}`}
                                className="InputsModalViES"
                                disabled
                                value={datosU[mostrarModalViES]?.ModeloAuto}
                              />
                              <br />
                              <input
                                type="text"
                                id={`PlacaAutoInv_${index}`}
                                name={`PlacaAutoInv_${index}`}
                                className="InputsModalViES"
                                disabled
                                value={datosU[mostrarModalViES]?.PlacaAuto}
                                style={{ marginTop: "15px" }}
                              />
                              <input
                                type="text"
                                id={`ColorAutoInv_${index}`}
                                name={`ColorAutoInv_${index}`}
                                className="InputsModalViES"
                                disabled
                                value={datosU[mostrarModalViES]?.ColorAuto}
                                style={{ marginTop: "15px" }}
                              />
                            </div>
                          </div>
                          <div className="ContenedorInputViES">
                            <div className="Col-25ViES">
                              <label className="ModalLabelViES">Sala</label>
                            </div>
                            <div className="Col-75ViES">
                              <input
                                type="text"
                                id={`Sala_${index}`}
                                name={`Sala_${index}`}
                                className="Inputs"
                                value={datosU[mostrarModalViES]?.Sala}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="ContenedorInputViES">
                            <div className="Col-25ViES">
                              <label className="ModalLabelViES">
                                Anfitrión
                              </label>
                            </div>
                            <div className="Col-75ViES">
                              <input
                                type="text"
                                id={`Encargado_${index}`}
                                name={`Encargado_${index}`}
                                className="Inputs"
                                value={datosU[mostrarModalViES]?.Encargado}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="ContenedorInputViES">
                            <div className="Col-25ViES">
                              <label className="ModalLabelViES">Asunto</label>
                            </div>
                            <div className="Col-75ViES">
                              <input
                                type="text"
                                id={`AsuntoJunta_${index}`}
                                name={`AsuntoJunta_${index}`}
                                className="Inputs"
                                value={datosU[mostrarModalViES]?.AsuntoJunta}
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Modal.Body>
                  </Modal>

                  <div className="col-50">
                    <form>
                      <label className="Labels mb-0">Nombre</label>
                      <input
                        type="text"
                        id={`NombreInv_${index}`}
                        name={`NombreInv_${index}`}
                        className="Inputs mt-1 mb-1"
                        value={item.Nombre}
                        disabled
                      />
                      <br />
                      <label className="Labels mb-0">Asunto de Junta</label>
                      <input
                        type="text"
                        id={`AsuntoJunta_${index}`}
                        name={`AsuntoJunta_${index}`}
                        className="Inputs mt-1 mb-1"
                        value={item.AsuntoJunta}
                        disabled
                      />
                      <br /> <label className="Labels mb-0">Encargado</label>
                      <input
                        type="text"
                        id={`Encargado_${index}`}
                        name={`Encargado_${index}`}
                        className="Inputs mt-1 mb-1"
                        value={item.Encargado}
                        disabled
                      />
                      <br />
                      <label className="Labels mb-0">Sala</label>
                      <input
                        type="text"
                        id={`Sala_${index}`}
                        name={`Sala_${index}`}
                        className="Inputs mt-1"
                        value={item.Sala}
                        disabled
                      />
                      <br />
                    </form>
                  </div>
                </div>
                <div className="Hora">
                  {item.HoraEntrada != null ? (
                    item.HoraEntrada.split(",").map((hora, index) => (
                      <span key={index}>
                        {hora}
                        <br />
                      </span>
                    ))
                  ) : (
                    <span key={index}>
                      <br />
                    </span>
                  )}
                </div>
                {/* <div className="Hora">
                    {item.HoraSalida && item.HoraSalida.split(',').length === item.HoraEntrada.split(',').length ? (
                      item.HoraSalida.split(',').map((hora, index) => (
                        <span key={index}>{hora}<br /></span>
                      ))
                      ) : (
                        <span>Sin salida</span>
                      )}
                  </div> */}
                <div className="Hora">
                  {item.HoraSalida ? (
                    <>
                      {item.HoraSalida.split(",").map((hora, index) => (
                        <span key={index}>
                          {hora}
                          <br />
                        </span>
                      ))}
                      {item.HoraSalida.split(",").length !==
                        item.HoraEntrada.split(",").length && (
                        <span style={{color: 'red'}}>Sin salida</span>
                      )}
                    </>
                  ) : (
                    <span style={{color: 'red', fontWeight: '500'}}>Sin salida</span>
                  )}
                </div>
              </div>
            ))
          )}
          </div>
        </div>
      </Container>
    </>
  );
}
