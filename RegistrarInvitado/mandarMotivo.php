<?php
include("conexion.php");
require 'vendor/autoload.php'; // Asegúrate de que tienes la biblioteca PHPMailer instalada
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin,X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Content-Type: application/json");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$data = json_decode(file_get_contents('php://input'), true);

$anfitrionCorreo = $data['anfitrion_correo'];
$asunto = $data['asunto'];
$motivo = $data['motivo'];
$admin = $data['admin'];

$sql = "SELECT * FROM usuario WHERE permisos='1'";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $adminNombre= $row['nombre'];
            $adminp= $row['apellido_paterno'];
            $adminm= $row['apellido_materno'];
            $adminName = $adminNombre." ".$adminp." ".$adminm;
        }

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
    $mail->addAddress($anfitrionCorreo);

    $mail->addEmbeddedImage('logo.png', 'logo_cid', 'logo.png', 'base64', 'image/png');

    $mail->isHTML(true);
    $mail->Subject = 'Motivo de eliminación de junta: ' . $asunto;
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
                <h2 style="font-size: 18px; margin-bottom: 10px;">Cancelanción de la reunión:</h2>
                <section>
                    <p>Hola,</p>
                    <p>La junta con el asunto "<strong>' . $asunto . '</strong>" ha sido eliminada por el administrador. El
                        motivo de la eliminación es:</p>
                    <p style="text-align: center;"><em>' . $motivo . '</em></p>
                    <section style="margin-top: 30px;">
                        <h2 style="font-size: 18px;">Atentamente,</h2>
                        <p>' . $adminName . '<br>' . $admin['correo'] . '</p>
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
    echo json_encode(['success' => true, 'message' => 'Correo enviado correctamente']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'No se pudo enviar el correo. Error: ' . $mail->ErrorInfo]);
}
?>
