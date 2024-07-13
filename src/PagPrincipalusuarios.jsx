import { Row, Col, Form, Container } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import PerfilD from "./imgs/user.png";
import "./CSS/PagPrincipalusuarios.css";

export function PagPrinusers() {

  const [user, setUser] = useState({
    nombre: "",
    apaterno: "",
    amaterno: "",
    correo: "",
    fotografia: "",
  });

  const Mostrarperfil = async () => {
    console.log("Cargando perfil");
    console.log("correo", window.localStorage.getItem("correo"));
    const datos = { correo: window.localStorage.getItem("correo") };
    try {
      const respuesta = await fetch(
        "http://localhost/RegistrAgil/Perfil/perfil.php",
        {
          method: "POST",
          body: JSON.stringify(datos),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await respuesta.json();
      console.log("respuesta obtenida: ", json);
      if (json.existe === false) {
        console.log("No existe el usuario");
      } else {
        setUser({
          nombre: json.nombre,
          apaterno: json.apellidop,
          amaterno: json.apellidom,
          correo: json.correo,
          fotografia: json.foto,
        });
      }
    } catch (error) {
      console.log("Error al cargar perfil", error);
    }
  };

  useEffect(() => {
    Mostrarperfil();
  }, []);

  return (
    <>
      <Container fluid id="inicio" className="mainContainer d-flex justify-content-center mt-5 ">
        <Row className="d-flex justify-content-center text-center ms-5 ms-sm-0" style={{ width: '80%' }}>
          <Col >
            {/* <Image
              src={user.fotografia || "https://via.placeholder.com/200"}
              alt="Foto de Perfil"
              className="rounded-circle card-foto"
              style={{ width: '100%', maxWidth: '200px', height: 'auto', objectFit: 'cover' }} 
            /> */}
             
            <div className="imagen-container">
              <img
                src={user.fotografia ? `data:image/jpeg;base64,${user.fotografia}` : PerfilD}
                alt="user"
                className="Usuario rounded-circle"
              />
            </div>

            <h1 className="mt-4" style={{ fontFamily: "Livvic, sans-serif", fontWeight: 600}}>Bienvenid@ {user.nombre} {user.apaterno}</h1>
          </Col>
        </Row>
      </Container>
    </>


    // <div className="mainContainer mainContainerPrin d-flex justify-content-center align-items-center">
    //   <Row className="Organizacion text-center">
    //     <Col>
          // <div className="imagen-container">
          //   <img
          //     src={`data:image/jpeg;base64,${user.fotografia}`}
          //     alt="user"
          //     className="Usuario"
          //   />
          // </div>
    //       <h1 className="title">Bienvenido {user.nombre}</h1>
    //     </Col>
    //   </Row>
    // </div>
  );
}
