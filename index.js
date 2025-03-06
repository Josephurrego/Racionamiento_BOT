const http = require("http");
const {initialize} = require('./attack')

const host = '0.0.0.0';
const port = 8000;

const server = http.createServer((req,res)=>{
    console.log('Entró');
    res.writeHead(200);
    res.end('Hola');
});
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
    initialize();
});