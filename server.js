const http = require('http');
const fs = require('fs');
const path = require('path');

const mimes = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.json': 'application/json',
};

http.createServer((req, res) => {
  let url = req.url === '/' ? '/tour360.html' : req.url;
  const filePath = path.join(__dirname, url);
  const ext = path.extname(filePath);
  const contentType = mimes[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    res.end(data);
  });
}).listen(3333, () => console.log('Server running on port 3333'));
