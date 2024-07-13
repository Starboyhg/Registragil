import {
  Container,
  Card,
  Row,
  Col,
  Image,
  Button,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import HeaderLogin from "./HeaderLogin";
import { FooterPG } from "../Footer";
import "../CSS/Administrador.css";
import IconoUsuario from "../imgs/usuario.png";
import { useNavigate, Link } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";

function LogIn() {
  const [inicioValidado, validarForm] = useState(false);
  const [usuarioInvalido, validarUsuario] = useState(false);
  const [passInvalido, validarPass] = useState(false);
  const [usuario, setUsername] = useState("");
  const [pass, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [passText, setPassText] = useState("Por favor llena todos los campos");
  const [userText, setUserText] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem("correo")) {
      switch(parseInt(localStorage.getItem("permiso"))) {
        case 1:
          navigate('/Administrador/Bienvenida');
          break;
        case 2:
          navigate('/Invitado/Bienvenida');
          break;
        case 3:
          navigate('/Recepcionista/Bienvenida');
          break;
        case 4:
          navigate('/Anfitrion/Bienvenida');
          break;        
      }
    }
  },[]);

  async function autenticar(url, data) {
    console.log("autenticando");
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data),
    });
    console.log(response);
    return response.json();
  }

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setPassText("Por favor llena todos los campos");
      validarForm(true);
    } else {
      validarForm(false);
      try {
        autenticar("http://localhost/RegistrAgil/Login/login.php", {
          correo: usuario,
          password: pass,
        }).then((data) => {
          console.log(data);
          if (!data || data === null) {
            console.log("No hay data");
          }

          if (data.conectado !== true) {
            setPassText("Usuario o Contraseña incorrectos");
            validarUsuario(true);
            validarPass(true);
          } else {
            console.log("Usuario Correcto");
            window.localStorage.setItem("correo", usuario);
            window.localStorage.setItem("permiso", data.permiso);
            if(data.bandera) {
              navigate('/ResetPassword?token='+ data.bandera);
            }else{
              switch (data.permiso) {
                case 1:
                  console.log("1");
                  navigate("/Administrador/Bienvenida");
                  break;
                case 2:
                  console.log("2");
                  navigate("/Invitado/Bienvenida");
                  break;
                case 3:
                  console.log("3");
                  navigate("/Recepcionista/Bienvenida");
                  break;
                case 4:
                  console.log("4");
                  navigate("/Anfitrion/Bienvenida");
                  break;
              }
            }
            
          }
          // JSON data parsed by `data.json()` call
        }); // Assuming you have the authenticate function
      } catch (e) {
        setPassText("Usuario o Contraseña incorrectos");
        validarUsuario(!e.user);
        validarPass(!e.pass);
      }
    }
  };

  return (
    <>
      <HeaderLogin />
      <Container fluid id="login" className="main-container d-flex justify-content-center mt-6 mb-6">
        <Row className="d-flex justify-content-center mb-5 mt-2" style={{ width: '80%', maxWidth: '470px' }}>
          <Col xs={12}>
            <Card.Title className="text-center mb-5 titulo fw-bold">Iniciar Sesión</Card.Title>
            <Card className="card-datos d-flex justify-content-center">
              <Card.Body>
                <Card.Title className="text-center">
                  <Image
                    src={IconoUsuario}
                    alt="Icono Usuario"
                    width="100px"
                    height="100px"
                    roundedCircle
                    className="mt-4 mb-4 card-foto"
                  />
                </Card.Title>
                <Form
                  method="post"
                  noValidate
                  validated={inicioValidado}
                  onSubmit={handleSubmit}
                >
                  <Row>
                    <Form.Group>
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Nombre de Usuario"
                        className="mb-3"
                      >
                        <Form.Control
                          required
                          type="user"
                          placeholder=""
                          name="user"
                          className="input card-input"
                          value={usuario}
                          onChange={(e) => setUsername(e.target.value)}
                          isInvalid={usuarioInvalido}
                        />
                        <Form.Control.Feedback type="invalid">
                          {userText}
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group className="position-relative">
                      <FloatingLabel
                        controlId="floatingPassword"
                        label="Contraseña"
                        className="mb-3"
                      >
                        <Form.Control
                          required
                          type={showPassword ? "text" : "password"}
                          placeholder=""
                          name="pass"
                          className="input card-input"
                          value={pass}
                          onChange={(e) => setPassword(e.target.value)}
                          isInvalid={passInvalido}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="input-eye"
                          style={{ color: '#0B1215', position: 'absolute', top: '15px', right: '35px', cursor: 'pointer' }}
                        >
                          {showPassword ? <Icon.EyeSlash /> : <Icon.Eye />}
                        </span>
                        <Form.Control.Feedback type="invalid">
                          {passText}
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>
                  </Row>
                  <Row className="justify-content-center mb-2 mt-4">
                    <Form.Group as={Col} xs="auto">
                      <Button className="boton" type="submit">
                        Iniciar Sesión
                      </Button>
                    </Form.Group>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Form.Group as={Col} xs="auto">
                      <Link to={"/RecoverPassword"}>
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </Form.Group>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <FooterPG />
    </>
  );
}

export default LogIn;
