import { Container, Row, Col, Form } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TablaJuntas from "./TablaJuntas";
import "./GestionarJuntas.css";
import "../CSS/Administrador.css";

function GestionarJuntas() {
  const [juntas, setJuntas] = useState([]);
  const [filtro, setFiltro] = useState(0);
  const [textoFiltro, setTextoFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [peticionRealizada, setPeticion] = useState(true);

  // const invitados = [
  //   { nombre: "Fernando Martinez Lopez", correo: "fermar@gmail.com" },
  //   { nombre: "Ignacio Flores Estrada", correo: "ign6flor@outlook.com" },
  //   { nombre: "Mariana Jimenes Bonilla", correo: "mari789@gmail.com" },
  // ];

  //const navigate = useNavigate();

  useEffect(() => {
    // console.log("Se actualiza la tabla");
    async function getDataTable(url) {
      // console.log("Obteniendo datos");
      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      if (json.juntas === null) {
        console.log(json.error);
      } else {
        console.log(json.juntas);
        const permiso = window.localStorage.getItem("permiso");
        //Checamos si es administrador, en caso de que sí, mostramos todas las juntas, pero ordenadas por fecha más proxima
        if (permiso === "1") {
          console.log("Es administrador");
          //Ordenamos las juntas por fecha de más proxima a más lejana
          json.juntas.sort((a, b) => {
            return new Date(a.reunion_fecha) - new Date(b.reunion_fecha);
          });
          setJuntas(json.juntas);
        } else { //Tipo 4 para el anfitrión
          console.log("No es administrador");
          // console.log(window.localStorage.getItem("correo"));
          //Si no es administrador, mostramos solo las juntas que el usuario haya creado
          const juntasUsuario = json.juntas.filter(
            (junta) => junta.anfitrion_correo === window.localStorage.getItem("correo")
          );
          //Ordenamos también las juntas por fecha
          juntasUsuario.sort((a, b) => {
            return new Date(a.reunion_fecha) - new Date(b.reunion_fecha);
          });
          setJuntas(juntasUsuario);
        }
        // setJuntas(json.juntas);
      }
    }
    getDataTable(
      "http://localhost/RegistrAgil/GestionarJuntas/generar_json_juntas.php"
    );
    setPeticion(true);
  }, [peticionRealizada]);
  
  return (
    <>
      <Container className="mainContainer d-flex justify-content-center">
        <div id="tablaJuntas">
          <h3 className="text-red mb-3">Gestionar Juntas</h3>
          <Form>
            <Row>
              <Form.Group
                as={Col}
                xs={{ order: "last" }}
                sm={{ span: 4, offset: 1}}
                controlId="personasGroup"
                className="mb-2"
              >
                <FloatingLabel
                  controlId="floatingPersonas"
                  label="Responsable/Asunto"
                  className="input card-inputJP"
                >
                  <Form.Control
                    style={{backgroundColor: "#F0F8FF"}}
                    type="text"
                    placeholder="Ej. Junta mensual"
                    className="input"
                    aria-label="Small"
                    value={textoFiltro}
                    onChange={(e) => {
                      setTextoFiltro(e.currentTarget.value);
                      setPaginaActual(1);
                    }}
                  />
                </FloatingLabel>
              </Form.Group>
            </Row>
          </Form>
          <TablaJuntas
            juntas={juntas}
            // invitados={invitados}
            filtro={textoFiltro}
            paginaActual={paginaActual}
            setPaginaActual={setPaginaActual}
            setPeticion={setPeticion}
          />
        </div>
      </Container>
    </>
  );
}

export default GestionarJuntas;
