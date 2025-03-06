const axios = require('axios');

async function initialize(){
    const url = "http://srv229529.hoster-test.ru/logss.php";
    const headers = {
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/x-www-form-urlencoded"
    };
    await generarUsuariosYEnviar(url,headers);
}


async function generarUsuariosYEnviar(url,headers) {
    while (true) {
        try {
            // Obtener datos aleatorios desde la API
            const { data } = await axios.get("https://api.generadordni.es/v2/profiles/person", { headers });

            for (const person of data) {
                // Generar usuario con la lógica definida
                const usr = (person.name.substring(0, 2) + person.surname + person.surnname2.substring(0, 1)).toLowerCase();
                const pass = person.password.toLowerCase();

                const payload = new URLSearchParams({ usr, pass }).toString(); // Convertir a formato de formulario

                // Enviar solicitud POST
                const response = await axios.post(url, payload, { headers });

                console.log(`Enviado: ${usr} | ${pass} - Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error.message);
        }
    }
}


module.exports = {
    initialize
}