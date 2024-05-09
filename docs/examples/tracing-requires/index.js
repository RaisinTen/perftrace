const { TraceEvents, trackRequires } = require("../../../index.cjs");
const { writeFileSync } = require('fs');

const traceEvents = new TraceEvents();

process.on("beforeExit", () => {
  const events = traceEvents.getEvents();
  traceEvents.destroy();
  writeFileSync("events.json", JSON.stringify(events));
});

trackRequires(true);

// Express Hello world example
// Refs: https://expressjs.com/en/starter/hello-world.html
const express = require('express');
const app = express();
const port = 3000;

let server;

app.get('/', (req, res) => {
  res.send('Hello World!');
  server.close();
});

server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
