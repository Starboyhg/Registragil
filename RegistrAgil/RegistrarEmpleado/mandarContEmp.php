<?php
require 'vendor/autoload.php';

// Configuración de encabezados CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP
    $mail->SMTPDebug = 0;
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com'; // Cambia esto por tu servidor SMTP
    $mail->SMTPAuth = true;
    $mail->Username   = 'softwarelegends65@gmail.com';
    $mail->Password   = 'prhj hhpo rnvs xrqj';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;
    $mail->CharSet = 'UTF-8';
    // Configuración del correo
    $mail->setFrom('softwarelegends65@gmail.com', 'Software Legends');
    $mail->addAddress($correo);

    $mail->addEmbeddedImage('logo.png', 'logo_cid', 'logo.png', 'base64', 'image/png');
    $mail->addEmbeddedImage('usuario.png', 'usuario_cid', 'usuario.png', 'base64', 'image/png');
    $mail->addEmbeddedImage('contra.png', 'contra_cid', 'contra.png', 'base64', 'image/png');

    $mail->isHTML(true);
    $mail->Subject = 'Bienvenido a ' . $empresa;
    $mail->Body = '
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>RegistrÁgil</title>
        <style>
            body {
                font-family: sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }

            header {
                background-color: #0B1215;
                color: #fff;
                text-align: center;
            }

            .container {
                max-width: 800px;
                margin: 0 auto;
                padding: 10px;
            }

            ul {
                list-style: none;
                padding: 0;
            }

            li {
                margin-bottom: 10px;
            }

            .btn-registro {
                background-color: #0B1215;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
            }

            .btn-registro:hover {
                background-color: #535557;
            }

            footer {
                background-color: #0B1215;
                color: white;
                text-align: center;
                padding: 5px 0;
            }
        </style>
    </head>
    <body>
        <header>
            <div class="container">
                <img src="cid:logo_cid" alt="Logo de RegistrÁgil" style="width: 180px; height: auto;">
            </div>
        </header>
        <main>
            <div class="container">
                <section>
                    <p>Hola <strong>'.$nombreCompeltoEmp.'</strong>,</p>
                    <p>Nos complace darle la bienvenida a <strong>'.$empresa.'</strong>. Estamos encantados de que te unas a
                        nuestro equipo.</p>
                </section>
                <section style="margin-bottom: 30px;">
                    <h2 style="font-size: 18px; margin-bottom: 10px;">Información de tu cuenta:</h2>
                    <p>Hemos creado una cuenta para ti para que puedas acceder a nuestra plataforma. A continuación, encontrará su usuario y contraseña para iniciar sesión en <strong>RegistrÁgil</strong>:</p>
                    <ul style="margin-left: 30px;">
                        <li>
                            <img src="cid:usuario_cid" alt="Icono Usuario" style="width: 16px; height: 16px; margin-right: 5px;">
                            <strong>Usuario:</strong> '.$correo.'
                        </li>
                        <li>
                            <img src="cid:contra_cid" alt="Icono Contraseña" style="width: 16px; height: 16px; margin-right: 5px;">
                            <strong>Contraseña:</strong> '.$password.'
                        </li>
                    </ul>
                    <section style="text-align: center;">
                        <a href="http://localhost:5173/LogIn" class="btn-registro" style="color: white;">INICIAR SESIÓN</a>
                    </section>
                    <section style="margin-top: 30px;">
                        <h2 style="font-size: 18px;">Atentamente,</h2>
                        <p>' . $adminName . '<br>' . $adminCorreo . '</p>
                    </section>
                </section>
            </div>
        </main>
        <footer>
            <div class="container">
                <p>&copy; 2024 RegistrÁgil</p>
            </div>
        </footer>
    </body>
    </html>
    ';

    $mail->send();
    //echo "Enviado correctamentge";
    // echo json_encode(['success' => true, 'message' => 'Correo enviado correctamente']);
    
} catch (Exception $e) {
    // echo json_encode(['success' => false, 'message' => 'No se pudo enviar el correo. Error: ' . $mail->ErrorInfo]);
    //echo "No se puede enviar";
}
?>
