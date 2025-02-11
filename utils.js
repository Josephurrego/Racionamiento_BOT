const axios = require('axios');
const PARAMS = {
    'where': '1=1',
    'outFields': '*',
    'f': 'json'
}; 

async function fetchData(){ // Obtener Datos de los turnos
    let res = await axios.get('https://services1.arcgis.com/J5ltM0ovtzXUbp7B/ArcGIS/rest/services/EsquemaRestriccion/FeatureServer/0/query',{params:PARAMS})
    console.log(res.status);
    let data =  res.data.features.map((e)=>{
        return {
            name:e.attributes.TURNO,
            fechaInicio: new Date(e.attributes.FECHA_INI),
            fechaFin: new Date(e.attributes.FECHA_FIN),
            sector:e.attributes.SECTOR
        }
    });
    data = data.sort((a,b)=>Number(a.name.substring(6))-Number(b.name.substring(6)))
    return data;
}

function getTurno(msg,data) {
    const turnoFilter = data.filter((e)=>e.name===`Turno ${msg}`); // Buscar Turno
    if (turnoFilter.length===0)return undefined;
    return turnoFilter[0];
}

function getMultipleTurno(turnos,data){
    return data.filter((e)=>turnos.includes(e.name));
}

function registerUserTurno(usersData,id,turno){
    if (usersData[id]){
        usersData[id].push(turno);
        return;
    };
    usersData[id] = [turno];
}

function deleteUserTurno(turno,usersData,id){
    if (usersData[id].includes(`Turno ${turno}`)){
        usersData[id].splice(usersData[id].indexOf(turno),1)
        return true;
    }
}

module.exports = {
    fetchData,
    getTurno,
    registerUserTurno,
    deleteUserTurno,
    getMultipleTurno
}