// Tiny HTTP static file server
// Refs: https://stackoverflow.com/a/29046869

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

http.createServer(function(request, response) {
  console.log(`Request url: "${request.url}"`);

  if (request.url === "/api/perftrace") {
    console.log("Serving perftrace endpoint");

    request.setEncoding('utf8');
    let rawData = '';
    request.on('data', (chunk) => { rawData += chunk; });
    request.on('end', () => {
      response.end();
      console.log(rawData);
      fs.writeFileSync("events.json", rawData);
      this.close();
    });
    return;
  }

  if (request.url === "/api/submit") {
    console.log("Serving submission endpoint");
    setTimeout(() => {
      response.end(JSON.stringify({
        data: "Submit trace"
      }));
    }, 250);
    return;
  }

  const data = [
    { name: "do", timeout: 270 },
    { name: "re", timeout: 311 },
    { name: "mi", timeout: 622 },
    { name: "fa", timeout: 808 },
    { name: "so", timeout: 234 },
    { name: "la", timeout: 245 },
    { name: "ti", timeout: 300 },
    { name: "to", timeout: 690 },
  ];

  const apiDataPrefix = "/api/data";
  if (request.url.startsWith(apiDataPrefix)) {
    const index = request.url.slice(apiDataPrefix.length);
    const value = data[index];
    if (!value) {
      console.log(`Error serving data ${index} endpoint`);
      response.writeHead(404, { 'Content-Type': contentType });
      response.end(`${index} not found`);
      return;
    }
    console.log(`Serving data ${index} endpoint`);
    setTimeout(() => {
      response.end(JSON.stringify({
        text: value.name,
        background: value.background,
        color: value.color
      }));
    }, value.timeout);
    return;
  }

  let filePath = '.' + request.url;
  if (filePath == './') {
    filePath = './index.html';
  } else if (filePath == './perftrace.mjs') {
    filePath = '../../../index.mjs';
  }
  const extname = path.extname(filePath);
  let contentType = 'text/html';
  switch (extname) {
    case '.js':
    case '.mjs':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.wav':
      contentType = 'audio/wav';
      break;
  }

  fs.readFile(filePath, function(error, content) {
    if (error) {
      console.log(`Error serving file "${filePath}": ${error.code}`);
      response.writeHead(404, { 'Content-Type': contentType });
      response.end(`File not found: ${error.code}`);
      return;
    }

    console.log(`Serving file: "${filePath}"`);
    response.writeHead(200, { 'Content-Type': contentType });
    response.end(content, 'utf-8');
  });
}).listen(8080);

console.log("Server running at http://localhost:8080");
