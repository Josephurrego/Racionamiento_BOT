const {getMultipleTurno} = require('./utils');
const DATE_OPTIONS = {
    weekday: 'long', // Nombre completo del día de la semana
    day: 'numeric', // Día del mes
    month: 'long', // Nombre completo del mes
    hour: 'numeric', // Hora
    minute: 'numeric', // Minutos
    hour12: true, // Indica si se usa el formato de 12 horas (AM/PM)
    timeZone: 'America/Bogota' // Ajusta la zona horaria a la de Colombia
};

function getTurnosMessage(data){
    let message = '';
    data.forEach(element => {
        message+=`*${element.name}:* ${element.sector}`+'\n\n'
    });
    return message.trimEnd();
}

async function replyWelcomeMessage(chat,data){
    const turnoMessage = getTurnosMessage(data); // Listar turnos para mensaje
    await chat.sendMessage('¡Hola!, soy Sisifredo, el bot que te recuerda tu turno de racionamiento de Agua🚰.');
    await chat.sendMessage('Selecciona tu turno de racionamiento escribiendo "_Recuérdame el turno 7_" y te lo recordaré.');
    await chat.sendMessage('Puedes ver tus turnos escribiendo "Ver mis turnos".\nAsi mismo puedes eliminar turnos escribienddo "_Elimíname el turno 8_" o si quieres eliminar todos escribe "_Elimíname todos_".')
    await chat.sendMessage(turnoMessage);
    await chat.sendMessage('Si no sabes cual es tu turno, preguntale a Chatico, wa.me/573160231524, o en la página oficial bogota.gov.co');
}

async function replyTurnosUsuario(chat,usuarioData,data) {
    if (!usuarioData || usuarioData.length===0){
        await chat.sendMessage('No tienes turnos registrados :(');
        await chat.sendMessage('Escribe "Recuerdame el turno 8" y te lo recordaré');
        return;
    };
    
    const dataTurnos = getMultipleTurno(usuarioData,data);
    let msgResponse = '';
    dataTurnos.forEach((e)=>{
        msgResponse += `*${e.name}:* ${e.fechaInicio.toLocaleString('es-ES',{ day: 'numeric', month: 'long' })}\n`
    })
    await chat.sendMessage(msgResponse)
}

async function replyTurno(chat,turno) {
    if (!turno){
        await chat.sendMessage('No encontré tu turno, asegurate de que esté bien escrito');
        return;
    }
    await chat.sendMessage(`El ${turno.name} comienza ${(turno.fechaInicio.toLocaleString('es-ES',DATE_OPTIONS))} y termina ${(turno.fechaFin.toLocaleString('es-ES',DATE_OPTIONS))}`);
    await chat.sendMessage('El dia antes de lo recordaré');
}

module.exports = {
    replyTurno,
    replyTurnosUsuario,
    replyWelcomeMessage
}