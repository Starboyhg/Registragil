<?php
    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    require 'vendor/autoload.php';

    $payload;

    function connect($db) {
        try {
            $dsn = "mysql:host={$db['host']};dbname={$db['db']};charset=UTF8;port={$db['port']}";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false
            ];
            $conn = new PDO($dsn, $db['user'], $db['pass'], $options);
            return $conn;
        } catch (PDOException $e) {
            return null;
        }
    }

    function getToken($header) {
        $auth = explode(' ', $header);
        return $auth[1];
    } 

    function isAuth($headers, $key) {
        if (array_key_exists('Authorization', $headers)) {
            $token = getToken($headers['Authorization']);
            try {
                $payload = (array) JWT::decode($token, new Key($key, 'HS256'));
                return ['status' => 200, 'payload' => $payload];
            } catch (\Throwable $th) {
                return ['status' => 432];
            }
        } else {
            return ['status' => 401];
        }
    }

    function genToken($payload, $key) {
        return JWT::encode($payload,$key, 'HS256');
    }

    function sendRestorePassword($correo, $keyword) {
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host         = 'smtp.gmail.com';
            $mail->SMTPAuth     = true;
            $mail->Username     = 'softwarelegends65@gmail.com';
            $mail->Password     = 'prhj hhpo rnvs xrqj';
            $mail->SMTPSecure   = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port         = 465;
            $mail->CharSet      = 'UTF-8';

            $mail->addAddress($correo);

            $payload = [
                'correo' => $correo,
                'exp' => time() + 1200
            ];

            $token = genToken($payload, $keyword);
            $mail->addEmbeddedImage('logo.png', 'logo_cid', 'logo.png', 'base64', 'image/png');

            $mail->isHTML(true);
            $mail->Subject      = 'Recuperar Contraseña - RegistrAgil';
            $mail->Body         = '
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
                    
                    .btn-registro {
                        background-color: #0B1215;
                        margin: 20px 0;
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
                        <h2 style="font-size: 18px; margin-bottom: 10px;">Recuperar Contraseña:</h2>
                        <section>
                            <p>Hola,</p>
                            <p>Para restablecer tu contraseña, haz clic en el siguiente botón:</p>
                            <section style="text-align: center;">
                                <a href="http://localhost:5173/ResetPassword?token='.$token.'" class="btn-registro" style="color: white;">Restablecer Contraseña</a>
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
            return true;
        }catch(Exception $e) {
            return false;
        }
    }
?>