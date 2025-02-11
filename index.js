const http = require("http");
const {client} = require('./wwebApp')

const host = 'localhost';
const port = 8000;

const server = http.createServer((req,res)=>{
    console.log('Entró');
    res.writeHead(200);
    res.end('Hola');
});
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
    client.initialize();
});