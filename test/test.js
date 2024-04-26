const { ok } = require("node:assert");
const { TraceEvents, trackRequires } = require("..");
const { after, before, describe, test } = require("node:test");
const { performance } = require("node:perf_hooks");

describe("interleaved events", async () => {
  let traceEvents;

  await before(async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 4000);

      traceEvents = new TraceEvents();

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
    });
  });

  let A, B, C;
  test("find events", () => {
    const events = traceEvents.getEvents();
    A = events.find((element) => element.name === "A");
    B = events.find((element) => element.name === "B");
    C = events.find((element) => element.name === "C");
    ok(A);
    ok(B);
    ok(C);
  });

  test("event ts values", () => {
    ok((A.ts / 1e6) >= 0);

    ok((B.ts / 1e6) >= 0);

    ok((C.ts / 1e6) >= 0.9);
    ok((C.ts / 1e6) <= 1.1);
  });

  test("event dur values", () => {
    ok((A.dur / 1e6) >= 1.9);
    ok((A.dur / 1e6) <= 2.1);

    ok((B.dur / 1e6) >= 0.9);
    ok((B.dur / 1e6) <= 1.1);

    ok((C.dur / 1e6) >= 1.9);
    ok((C.dur / 1e6) <= 2.1);
  });

  after(() => {
    traceEvents.destroy();
  });
});

describe("track requires", async () => {
  let traceEvents;

  await before(async () => {
    traceEvents = new TraceEvents();
    console.log(traceEvents);
    trackRequires(true);
    require("node:tls");
    trackRequires(false);
    require("node:net");

    return new Promise((resolve, reject) => setImmediate(resolve));
  });

  test("find events", () => {
    const events = traceEvents.getEvents();
    const requireTls = events.find((element) => element.name === `require("node:tls")`);
    ok(requireTls);
    const requireNet = events.find((element) => element.name === `require("node:net")`);
    ok(!requireNet);
  });

  after(() => {
    traceEvents.destroy();
  });
});
