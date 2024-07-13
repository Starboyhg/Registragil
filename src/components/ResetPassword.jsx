
import { Container, Card, CardBody, Row, Col, Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useState, useEffect } from "react";
import HeaderLogin from "./HeaderLogin";
import "../CSS/Administrador.css"; // Importa el archivo CSS 
import { useNavigate, useLocation } from "react-router-dom";
import { FooterPG } from "../Footer";

function ResetPassword() {
    const [newPassword, setNewPassword] = useState(""); 
    const [confirmPassword, setConfirmPassword] = useState(""); 
    const [passwordMatch, setPasswordMatch] = useState(false); 
    const navigate = useNavigate();
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [tituloModal, settituloModal] = useState("");

    //No se está utilizando
    // Expresión regular para validar la contraseña
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;

    //No se está utilizando
    // Función para validar la contraseña
    // const validarContraseña = (password) => {
    //     return passwordRegex.test(password);
    // };

    const token = new URLSearchParams(useLocation().search).get("token");

    useEffect(() => {
        if(token){
            const options = {
                method : 'GET',
                mode: 'cors',
                credentials: 'same-origin',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization' : 'Bearer '+ token
                },
                referrerPolicy: "no-referrer"
              };

              fetch("http://localhost/RegistrAgil/recuperarContra/recuperar.php", options)
              .then(response => response.json())
              .then(data => {
                if(!data.success) {
                    //Modal o Alerta que no esta autorizado o el token expiro
                    alert(data.error);
                    navigate('/Inicio');
                }
              })
        }else{
            navigate('/Inicio');
        }
        const errores = generarMensajesError(newPassword);
        setPasswordErrors(errores);
        setPasswordMatch(confirmPassword === newPassword && errores.length === 0);
    },[]);

    // Mensajes de error para las validaciones de contraseña
    const mensajesError = {
        longitud: "La contraseña debe tener al menos 8 caracteres.",
        mayusculas: "La contraseña debe contener al menos una mayúscula.",
        minusculas: "La contraseña debe contener al menos una minúscula.",
        numeros: "La contraseña debe contener al menos un número.",
        caracteres: "La contraseña debe contener al menos un caracter especial.",
        coincidencia: "Las contraseñas no coinciden."
    };

    const generarMensajesError = (password) => {
        const errores = [];
        if (password.length < 8) errores.push(mensajesError.longitud);
        if (!/(?=.*[a-z])/.test(password)) errores.push(mensajesError.minusculas);
        if (!/(?=.*[A-Z])/.test(password)) errores.push(mensajesError.mayusculas);
        if (!/(?=.*\d)/.test(password)) errores.push(mensajesError.numeros);
        if (!/(?=.*[^\da-zA-Z])/.test(password)) errores.push(mensajesError.caracteres);
        return errores;
    };

    useEffect(() => {
        const errores = generarMensajesError(newPassword);
        setPasswordErrors(errores);
        setPasswordMatch(confirmPassword === newPassword && errores.length === 0);
    }, [newPassword, confirmPassword]);

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value); 
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value); 
        setConfirmPasswordError(value === newPassword ? "" : mensajesError.coincidencia);
    };

    const handleClose = () => {
        setShowErrorModal(false);
        const permiso = parseInt(localStorage.getItem("permiso")); 
        console.log(permiso);
        if(permiso) {
            //Si viene de Login
            switch (permiso) {
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
        }else {
            navigate('/LogIn');
        }
    }

    // Manejador de envío del formulario
    //Falta hacer la conexión con back para el envio de la nueva contraseña
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwordMatch) {
            
            const options = {
                method : 'PUT',
                mode: 'cors',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : 'Bearer '+ token
                },
                body : JSON.stringify({'clave' : newPassword}),
                referrerPolicy: "no-referrer"
            };

            fetch("http://localhost/RegistrAgil/recuperarContra/recuperar.php", options)
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    //Modals
                    settituloModal("Contraseña Modificada con Éxito");
                    setErrorMessage("Tu contraseña ha sido modificada correctamente. Serás redirigido a tu pantalla de inicio.");
                    setShowErrorModal(true);
                }else{
                    //Mostra modal, alerta, mySwal del error: data.error tiene el error
                    alert(data.error);
                    console.log(data.error);
                }
            });
        } else {
            console.log("Las contraseñas no coinciden o no cumplen con los requisitos.");
        }
    };

    const handleCancelar = () => {
        navigate("/Inicio");
    };

    return (
        <>
            <HeaderLogin />
            <Container fluid className="main-container d-flex justify-content-center mt-6 mb-6">
                <Row className="d-flex justify-content-center mb-4">
                    <Col xs={12}>
                        <Card.Title className="text-center mb-5 titulo fw-bold mt-2">Restablecimiento de Contraseña</Card.Title>
                        <Card className="card-datos d-flex justify-content-center">
                            <CardBody>
                                <p className="mb-1" style={{ textAlign: "center" }}>
                                    Ingresa una nueva contraseña para tu cuenta, la contraseña debe contener<br />
                                    mayúsculas, minúsculas, números y caracteres, así como un número <br />
                                    mínimo de tamaño de 8 valores. Confirma tu contraseña y podrás <br />
                                    ingresar a tu cuenta.
                                </p>
                                <br />
                                <Form method="post" onSubmit={handleSubmit}>
                                    <Row>
                                        <Form.Group as={Col}>
                                            <FloatingLabel
                                                controlId="newPassword"
                                                label="Nueva Contraseña"
                                                className="mb-3"
                                            >
                                                <Form.Control
                                                    className="card-input"
                                                    type="password"
                                                    placeholder="Introduce tu nueva contraseña"
                                                    value={newPassword}
                                                    onChange={handleNewPasswordChange}
                                                    onBlur={handleNewPasswordChange}
                                                    //Se modifica la validación para mostrar los mensajes de error
                                                    isInvalid={passwordErrors.length > 0 }
                                                    // isInvalid={!passwordMatch && intentoEnvio} // Marca el campo como inválido si las contraseñas no coinciden o no cumplen con las validaciones y se ha intentado enviar el formulario
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {passwordErrors.map((error, index) => (
                                                        <div key={index}>{error}</div>
                                                    ))}
                                                </Form.Control.Feedback>
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group as={Col}>
                                            <FloatingLabel
                                                controlId="confirmPassword"
                                                label="Confirmar Contraseña"
                                                className="mb-3"
                                            >
                                                <Form.Control
                                                    className="card-input"
                                                    type="password"
                                                    placeholder="Confirma tu nueva contraseña"
                                                    value={confirmPassword}
                                                    onChange={handleConfirmPasswordChange}
                                                    onBlur={handleConfirmPasswordChange}
                                                    //Se hace lo mismo que en el campo anterior
                                                    isInvalid={confirmPasswordError }
                                                    // isInvalid={!passwordMatch && intentoEnvio} // Marca el campo como inválido si las contraseñas no coinciden o no cumplen con las validaciones y se ha intentado enviar el formulario
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {confirmPasswordError}
                                                </Form.Control.Feedback>
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Row>
                                    <br />
                                    <Row className="justify-content-center mb-2" style={{ textAlign: "center" }}>
                                        <Form.Group as={Col} xs={6}>
                                            <Button variant="secondary" type="button" onClick={handleCancelar} className="boton">
                                                Cancelar
                                            </Button>
                                        </Form.Group>
                                        <Form.Group as={Col} xs={6}>
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                className="boton"
                                                //Se comenta para que el botón esté siempre activo y se muestren los mensajes de error
                                                // disabled={!passwordMatch}
                                            >
                                                Aceptar
                                            </Button>
                                        </Form.Group>
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <FooterPG />
            {/* Modal de error */}
            <Modal show={showErrorModal} className="custom-modal" onHide={() => {setShowErrorModal(false);}} centered>
            <Modal.Header closeButton>
            <Modal.Title>{tituloModal}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="paddingBody">
            <p className="parrafoModal">{errorMessage}</p>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" className="boton" onClick={() => {handleClose();}}>
                Aceptar
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}

export default ResetPassword;
