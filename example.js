const { TraceEvents } = require(".");

const { performance } = require("node:perf_hooks");
const { writeFileSync } = require("node:fs");

const traceEvents = new TraceEvents();

process.on("beforeExit", () => {
  const events = traceEvents.getEvents();
  traceEvents.destroy();
  writeFileSync("events.json", JSON.stringify(events));
});

performance.mark("A");
setTimeout(() => {
  performance.measure("A", "A");    // 2s [0s - 2s]
}, 2000);

performance.mark("B");
setTimeout(() => {
  performance.measure("B", "B");    // 1s [0s - 1s]
  performance.mark("C");
  setTimeout(() => {
    performance.measure("C", "C");  // 2s [1s - 3s]
  }, 2000);
}, 1000);
