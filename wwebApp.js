const { Client, LocalAuth} = require('whatsapp-web.js');
const {
    fetchData,
    getTurno,
    registerUserTurno,
    deleteUserTurno
} = require('./utils');
const {
    replyTurno,
    replyTurnosUsuario,
    replyWelcomeMessage
} = require('./predefinedMessages');

const cron = require('node-cron');
const OPTIONS = {
    scheduled: true,
    timezone: "America/Bogota"
}

let activeUsers = {}
let usersData = {}
var data;

// Create a new client instance
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

// When the client is ready, run this code (only once)
client.once('ready', async () => {
    console.log('Client is ready!');
    data = await fetchData();
    console.log('Data Downloaded')
    initializeTasks();
});

// When the client received QR-Code
client.on('qr', (qr) => {
    console.log(qr)
    console.log('ese es');
});

client.on('message',async (msg) => {
    const chat = await msg.getChat();
    const isActive = activeUsers[msg.from];
    activeUsers[msg.from] = Date.now();

    if (!isActive){
        await replyWelcomeMessage(chat,data);
        return;
    }
    if(/recu[eé]rdame el turno [0-9].*/.test(msg.body.toLocaleLowerCase())){
        const cleanMSG = msg.body.toLocaleLowerCase().replace(/recu[eé]rdame el turno /,'')
        const turno = getTurno(cleanMSG,data);
        if (turno){
            registerUserTurno(usersData,msg.from,turno.name);
        };
        await replyTurno(chat,turno)
        return;
    };
    if(/elim[íi]name todos/.test(msg.body.toLocaleLowerCase())){
        usersData[msg.from] = []
        await chat.sendMessage('Ya eliminé todos los turnos que tenías.')
        return;
    }
    if(/elim[íi]name el turno [0-9].*/.test(msg.body.toLocaleLowerCase())){
        const cleanMSG = msg.body.toLocaleLowerCase().replace(/elim[íi]name el turno /,'');
        if (deleteUserTurno(cleanMSG,usersData,msg.from)){
            await chat.sendMessage(`El Turno ${cleanMSG} ha sido elimando correctamente`);
            return
        }
        await chat.sendMessage('El turno no existe');
        return;
    };
    if (msg.body.toLocaleLowerCase()==='ver mis turnos'){
        await replyTurnosUsuario(chat,usersData[msg.from],data);
        return;
    };

    await chat.sendMessage('No entendí tu repuesta');
    await chat.sendMessage('Recuerda que puedes agregar un turno escrbiendo "_Recuerdame el turno 6_" ó puedes eliminar escribiendo "_Eliminame el turno 2_"');
})


function initializeTasks(){
    console.log('Initializing background tasks');

    cron.schedule('40 19 * * *', async () => {
        const today = new Date();
        const todayTurno = data.filter((e)=>e.fechaInicio.getDate()===today.getDate() && e.fechaInicio.getMonth()===today.getMonth())[0].name.replace('Turno ','');
        const usersToRemind = Object.keys(usersData).filter((e)=>usersData[e].includes(`Turno ${Number(todayTurno)+1}`));
        for (const i of usersToRemind){
            const chat = await client.getChatById(i);
            await chat.sendMessage(`Veciiiiiiiiiiiii, mañana el turno ${Number(todayTurno)+1} no tiene agua😞`);
            await chat.sendMessage('Recuerda bañarte y no solo hoy🚰.');
        }
    },OPTIONS);
    
    cron.schedule('*/2 * * * *', async () => {
        const now = Date.now();
        for(const key in activeUsers){
            if ((now-activeUsers[key])<300000)continue;
            await client.sendMessage(key,'Chao, se va por la sombrita');
            delete activeUsers[key];
        };
    });
}
module.exports = {
    client
}