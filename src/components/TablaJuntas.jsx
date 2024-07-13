import { Container, Row, Col, Form, Pagination } from "react-bootstrap";
// import Pagination from "react-bootstrap/Pagination";
import EditarJuntas from "./EditarJuntas";
import BorrarJuntas from "./BorrarJuntas";
import VerInvitados from "./VerInvitados";
import { useEffect, useState } from "react";
import "../CSS/TablaJuntas.css";

function TablaJuntas({
  juntas,
  filtro,
  paginaActual,
  setPaginaActual,
  setPeticion,
}) {
  const [paginacion, setPaginacion] = useState([]);
  const [rows, setRows] = useState([]);
  const juntasMaximas = 2;
  const maxPaginas = 3;
  

  useEffect(() => {
    // console.log(juntas);
    let contador = 0;
    let control = 0;
    let pag = [];
    let filas = [];
    juntas.forEach((junta) => {
      let nombreAnfitrion = `${junta.anfitrion_nombre} ${junta.anfitrion_apellido_paterno} ${junta.anfitrion_apellido_materno}`;
      if ((nombreAnfitrion + " " + junta.reunion_concepto).toLowerCase().indexOf(filtro.toLowerCase()) === -1) {
        return;
      }
      
      contador++;
      control = contador - juntasMaximas * (paginaActual - 1);
      if (control <= 0 || control > juntasMaximas) {
        return;
      }
      filas.push(
        <Container className="card-datos d-flex justify-content-center cont-junta" key={contador}>
          <Row>
            <Col xs={12} md={12} lg={6} xl={6}>
              <Row>
                <Col xs={12} md={12} lg={12} xl={4}>
                  <Form.Group>
                    <Form.Label className="mb-0 mt-1">Fecha</Form.Label>
                    <Form.Control
                      className="input card-input card-inputJP"
                      value={junta.reunion_fecha}
                      type="text"
                      readOnly
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={6} xl={4}>
                  <Form.Group>
                    <Form.Label className="mb-0 mt-1">Hora de Inicio</Form.Label>
                    <Form.Control
                      className="input card-input card-inputJP"
                      value={junta.reunion_horaInicio}
                      type="text"
                      readOnly
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={6} xl={4}>
                  <Form.Group>
                    <Form.Label className="mb-0 mt-1">Hora de Fin</Form.Label>
                    <Form.Control
                      className="input card-input card-inputJP"
                      value={junta.reunion_horaFin}
                      type="text"
                      readOnly
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={12} lg={12} xl={12}>
                  <Form.Group>
                    <Form.Label className="mb-0 mt-3">Anfitrion</Form.Label>
                    <Form.Control
                      className="input card-input card-inputJP"
                      value={nombreAnfitrion}
                      type="text"
                      readOnly
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={12} lg={12} xl={12}>
                  <Form.Group>
                    <Form.Label className="mb-0 mt-3">Asunto</Form.Label>
                    <Form.Control
                      className="input card-input card-inputJP"
                      value={junta.reunion_concepto}
                      type="text"
                      readOnly
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={12} lg={12} xl={12}>
                  <Form.Group>
                    <Form.Label className="mb-0 mt-3">Sala</Form.Label>
                    <Form.Control
                      className="input card-input mb-2 card-inputJP"
                      value={junta.reunion_sala}
                      type="text"
                      readOnly
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col xs={12} md={12} lg={6} xl={6}>
              <Row>
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label className="mb-0 mt-1">Descripcion</Form.Label>
                    <Form.Control
                      className="input card-input mb-2 card-inputJP"
                      as="textarea"
                      value={junta.reunion_descripcion}
                      readOnly
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col xs={4}>
                  <Form.Group>
                    <Row style={{ textAlign: 'center' }}>
                      <Col>
                        <Form.Label className="mb-0 mt-4">Lista de Invitados</Form.Label>
                      </Col>
                    </Row>
                    <Row style={{ textAlign: 'center' }}>
                      <Col>
                        <VerInvitados
                          junta={{
                            horaInicio: junta.reunion_horaInicio,
                            fecha: junta.reunion_fecha,
                            sala: junta.reunion_sala,
                            correo: junta.anfitrion_correo,
                            asunto: junta.reunion_concepto,
                            descripcion: junta.reunion_descripcion,
                            ubicacion: junta.reunion_ubicacion,
                          }}
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
                <Col xs={4}>
                  <Form.Group>
                    <Row style={{ textAlign: 'center' }}>
                      <Col>
                        <Form.Label className="mb-0 mt-4">Editar Junta</Form.Label>
                      </Col>
                    </Row>
                    <Row style={{ textAlign: 'center' }}>
                      <Col>
                        <EditarJuntas setPeticion={setPeticion} junta={junta} />
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
                <Col xs={4}>
                  <Form.Group>
                    <Row style={{ textAlign: 'center' }}>
                      <Col>
                        <Form.Label className="mb-0 mt-4">Borrar Junta</Form.Label>
                      </Col>
                    </Row>
                    <Row style={{ textAlign: 'center' }}>
                      <Col>
                        <BorrarJuntas setPeticion={setPeticion} junta={junta} />
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      );
    });

    setRows(filas);
    const paginasMaximas = Math.ceil(contador / juntasMaximas);
    const startPage = Math.max(1, paginaActual - Math.floor(maxPaginas / 2));
    const endPage = Math.min(paginasMaximas, startPage + maxPaginas - 1);
    // console.log(contador);
    for (let index = startPage; index <= endPage; index++) {
      pag.push(
        <Pagination.Item key={index} active={index === paginaActual} onClick={() => setPaginaActual(index)}>
          {index}
        </Pagination.Item>
      );
    }
    // setRows(filas);
    setPaginacion(pag);
  }, [juntas, paginaActual, filtro]);

  const handleFirst = () => setPaginaActual(1);
  const handlePrev = () => setPaginaActual(Math.max(1, paginaActual - 1));
  const handleNext = () => setPaginaActual(Math.min(Math.ceil(juntas.length / juntasMaximas), paginaActual + 1));
  const handleLast = () => setPaginaActual(Math.ceil(juntas.length / juntasMaximas));

  return (
    <>
      <div className="containerJunta">
        {rows.length > 0 ? rows : <p>No se encontraron juntas.</p>}
      </div>
      <Container className="paginacion mt-0">
        <Row style={{width: 'min-content'}}>
          <Pagination as={Col} variant="danger" className="card-inputJP" style={{paddingRight: '0'}} size="sm">
            <Pagination.First onClick={handleFirst} />
            <Pagination.Prev onClick={handlePrev} />
            {paginacion}
            <Pagination.Next onClick={handleNext} />
            <Pagination.Last onClick={handleLast} />
          </Pagination>
        </Row>
      </Container>
    </>
  );
}
export default TablaJuntas;
