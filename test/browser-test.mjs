import { expect } from "@esm-bundle/chai";
import { TraceEvents } from "../index.mjs";

describe("interleaved events", async () => {
  let traceEvents;

  before(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1500);

      traceEvents = new TraceEvents();

      performance.mark("A");
      setTimeout(() => {
        performance.measure("A", "A"); // 1000ms [0ms - 1000ms]
      }, 1000);

      performance.mark("B");
      setTimeout(() => {
        performance.measure("B", "B"); // 300ms [0ms - 300ms]
        performance.mark("C");
        setTimeout(() => {
          performance.measure("C", "C"); // 700ms [300ms - 1000ms]
        }, 700);
      }, 300);
    });
  });

  let A, B, C;
  it("find events", () => {
    const events = traceEvents.getEvents();
    A = events.find((element) => element.name === "A");
    B = events.find((element) => element.name === "B");
    C = events.find((element) => element.name === "C");
    expect(A).to.be.ok;
    expect(B).to.be.ok;
    expect(C).to.be.ok;
  });

  it("event ts values", () => {
    expect(A.ts).to.be.greaterThanOrEqual(0);

    expect((B.ts - A.ts) / 1e6).to.be.greaterThanOrEqual(0);
    expect((B.ts - A.ts) / 1e6).to.be.lessThanOrEqual(0.1);

    expect(C.ts - B.ts).to.be.greaterThanOrEqual(B.dur);
    expect(C.ts - B.ts).to.be.lessThanOrEqual(B.dur + 0.1 * 1e6);
  });

  it("event dur values", () => {
    expect(A.dur / 1e6).to.be.greaterThanOrEqual(0.9);
    expect(A.dur / 1e6).to.be.lessThanOrEqual(1.1);

    expect(B.dur / 1e6).to.be.greaterThanOrEqual(0.2);
    expect(B.dur / 1e6).to.be.lessThanOrEqual(0.4);

    expect(C.dur / 1e6).to.be.greaterThanOrEqual(0.6);
    expect(C.dur / 1e6).to.be.lessThanOrEqual(0.8);
  });

  after(() => {
    traceEvents.destroy();
  });
});
