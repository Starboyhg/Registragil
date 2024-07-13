import { Html5QrcodeScanner } from "html5-qrcode";
//useEffect ejecuta codigo despues de que el componente se renderiza
//useState indica el estado del resultado del escaneo
import { useEffect, useState } from "react";
// const urlPerfil="http://localhost/login/qr.php";
import "./QRscanner.css";

function QRscanner({ onDataReceived, setQR }) {
  const solicitud = async (datos) => {
    // console.log("obteniendo llave");
    // console.log("llave", datos);
    try {
        //solicitud
        console.log("solicitando datos con la llave: ", datos);
        const respuesta=await fetch("http://localhost/RegistrAgil/Recepcionista/qr.php", {
          method: 'POST',
          body: JSON.stringify(datos),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      //la respuesta se almacena en un json
      // console.log("respuesta obtenida", respuesta);
      const json = await respuesta.json();
      //impresión de la respuesta en consola para ver qué se obtuvo
      console.log("respuesta obtenida: ", json);
      //verifica el campo 'existe' del json generado por la respuesta del servidor (perfil.php)
      if (json.existe == false) {
        console.log("No existe el usuario");
      } else {
        console.log("Datos del usuario", json);
        onDataReceived(json);
      }
    } catch (error) {
      console.log("Error al cargar datos", error);
    }
  };
  const [scanResult, setScanResult] = useState(null);
  useEffect(() => {
    //objeto del escaner
    //reader es el id del div donde se renderiza el escaner
    const scanner = new Html5QrcodeScanner("reader", {
      //tamaño del cuadro de escaneo
      qrbox: {
        width: 200,
        height: 200,
      },
      //tiempo de espera para escanear
      fps: 15,
    });
    //funcion que se ejecuta cuando se escanea un codigo
    function success(result) {
      //limpia el escaner
      // scanner.clear(); Segun yo el error de que se queda en blanco es por esto
      // let scanner = new Html5QrcodeScanner("reader");
      //muestra el resultado del escaneo
      setScanResult(result);
      setQR(result);
      const llave = { id_qr: result };
      console.log("parametro a mandar en la solicitud", llave);
      solicitud(llave);
      //solicitud post al servidor
    }
    //funcion que se ejecuta si hay un error
    function error(err) {
      //muestra el error en la consola
      console.warn(err);
    }
    //renderiza el escaner, recibe dos funciones, una si se escanea correctamente y otra si hay un error
    scanner.render(success, error);
  }, []);

return (

<div className="App">
  <header className="App-header">
    <div>
      <h2>Escanea el QR</h2>
      <div id="reader"></div>
    </div>
  </header>
</div>
);
}

export default QRscanner;
