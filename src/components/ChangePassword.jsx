import { Container, Card, CardBody, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useState, useEffect } from "react";
import HeaderLogin from "./HeaderLogin";
import { useNavigate } from "react-router-dom";
// import "../CSS/Administrador.css";

function ChangePassword() {
    const [newPassword, setNewPassword] = useState(""); 
    const [confirmPassword, setConfirmPassword] = useState(""); 
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [passwordMatch, setPasswordMatch] = useState(false); 
    // const [intentoEnvio, setIntentoEnvio] = useState(false); 
    const navigate = useNavigate();

    // Expresión regular para validar la contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;

    // Mensajes de error para las validaciones de contraseña
    const mensajesError = {
        longitud: "La contraseña debe tener al menos 8 caracteres.",
        mayusculas: "La contraseña debe contener al menos una mayúscula.",
        minusculas: "La contraseña debe contener al menos una minúscula.",
        numeros: "La contraseña debe contener al menos un número.",
        caracteres: "La contraseña debe contener al menos un caracter especial.",
        coincidencia: "Las contraseñas no coinciden."
    };

    // Función para generar mensajes de error basados en las validaciones de contraseña
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

    // Manejador de cambio para el campo de nueva contraseña
    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value); 
    };;

    // Manejador de cambio para el campo de confirmar contraseña
    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value); 
        setConfirmPasswordError(value === newPassword ? "" : mensajesError.coincidencia);
    };

    // Manejador de envío del formulario
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     setIntentoEnvio(true);
    //     if (passwordMatch) {
    //         alert("Contraseña modificada correctamente");
    //         navigate("/LogIn");
    //     } else {
    //         console.log("Las contraseñas no coinciden o no cumplen con los requisitos.");
    //     }
    // };

    // Manejador de envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        // setIntentoEnvio(true);
        if (passwordMatch) {
            const correo = window.localStorage.getItem("correo");
            const datos = {
                correo,
                nuevaContrasena: newPassword,
            };

            try {
                // const respuesta = await fetch("http://localhost/Registragil/RestoRutaDelphpCambiarContra.php", {
                //     method: "POST",
                //     body: JSON.stringify(datos),
                //     headers: {
                //         "Content-Type": "application/json",
                //     },
                // });
                // alert("Contraseña modificada correctamente");
                navigate("/LogIn");
            } catch (error) {
                console.log("Error al cambiar la contraseña:", error);
            }
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
            <br />
            <Container
                fluid
                id="login"
                className="mainContainer d-flex justify-content-center align-items-center"
            >
                <Row className="d-flex justify-content-center">
                    <h2>Cambio de Contraseña</h2>
                </Row>
            </Container>
            <br></br>
            <Container
                fluid
                id="login"
                className="mainContainer d-flex justify-content-center"
            >
                <Row className="d-flex justify-content-center">
                    <Card className="card-container d-flex justify-content-center">
                        <CardBody>
                            <Card.Title className="text-center"></Card.Title>
                            <p className="mb-3" style={{ textAlign: "center" }}>
                            Por ser tu primer inicio de sesión dentro de nuestro sistema te pedimos que, <br />
                            por favor, cambies tu contraseña a una clave única que sólo tú sepas y <br />
                            recuerdes.<br />
                            Ten en cuenta que la contraseña debe contener mayúsculas, minúsculas, <br />
                            números y caracteres, así como un tamaño mínimo de 8 símbolos.<br />
                            Después confirma tu contraseña y vuelve a iniciar sesión.
                            </p>
                            <br></br>
                            <Form method="post" onSubmit={handleSubmit}>
                                <Row>
                                    <Form.Group as={Col}>
                                        <FloatingLabel
                                            controlId="newPassword"
                                            label="Nueva Contraseña"
                                            className="mb-3"
                                        >
                                            <Form.Control
                                                type="password"
                                                placeholder="Introduce tu nueva contraseña"
                                                value={newPassword}
                                                onChange={handleNewPasswordChange}
                                                isInvalid={passwordErrors.length > 0} // Marca el campo como inválido si hay errores de contraseña y se ha intentado enviar el formulario
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
                                                type="password"
                                                placeholder="Confirma tu nueva contraseña"
                                                value={confirmPassword}
                                                onChange={handleConfirmPasswordChange}
                                                isInvalid={confirmPasswordError} // Marca el campo como inválido si hay errores de confirmación de contraseña y se ha intentado enviar el formulario
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {confirmPasswordError}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Row>
                                <br></br>
                                <Row className="justify-content-center" style={{ textAlign: "center" }}>
                                    <Form.Group as={Col} xs={6}>
                                        <Button variant="secondary" type="button" onClick={handleCancelar}>
                                            Cancelar
                                        </Button>
                                    </Form.Group>
                                    <Form.Group as={Col} xs={6}>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            // disabled={!passwordMatch}
                                        >
                                            Aceptar
                                        </Button>
                                    </Form.Group>
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                </Row>
            </Container>
        </>
    );
}

export default ChangePassword;
