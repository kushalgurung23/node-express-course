const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, {'content-type': 'text/html'})
    res.write('<h1>KUSHAL GURUNG </h1>');
    res.end();
});

server.listen(5000);
// 4:20:13