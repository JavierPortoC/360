const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const mimes = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.mp4':  'video/mp4',
  '.json': 'application/json',
};

http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const headers = { 'Access-Control-Allow-Origin': '*' };

  // /video?p=absolute_path  → stream any file from filesystem
  if (parsed.pathname === '/video' && parsed.query.p) {
    const filePath = parsed.query.p;
    const ext = path.extname(filePath).toLowerCase();
    const ct = mimes[ext] || 'application/octet-stream';
    fs.stat(filePath, (err, stat) => {
      if (err) { res.writeHead(404); res.end('Not found'); return; }
      const range = req.headers.range;
      if (range) {
        const [s, e] = range.replace(/bytes=/, '').split('-');
        const start = parseInt(s, 10);
        const end   = e ? parseInt(e, 10) : stat.size - 1;
        const chunk = end - start + 1;
        res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': chunk, 'Content-Type': ct });
        fs.createReadStream(filePath, { start, end }).pipe(res);
      } else {
        res.writeHead(200, { ...headers, 'Content-Length': stat.size, 'Content-Type': ct, 'Accept-Ranges': 'bytes' });
        fs.createReadStream(filePath).pipe(res);
      }
    });
    return;
  }

  let reqPath = parsed.pathname === '/' ? '/tour360.html' : parsed.pathname;
  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath);
  const contentType = mimes[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { ...headers, 'Content-Type': contentType });
    res.end(data);
  });
}).listen(3333, () => console.log('Server running on port 3333'));
