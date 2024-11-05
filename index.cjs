const { PerformanceObserver, performance } = require('node:perf_hooks');

// Refs: https://stackoverflow.com/a/47105238
function thisLine() {
  const e = new Error();
  const regex = /\((.*):(\d+):(\d+)\)$/;
  const match = regex.exec(e.stack.split("\n")[4]);
  return {
    filepath: match[1],
    line: Number(match[2]),
    column: Number(match[3]),
  };
}

class TraceEvents {
  _eventObjects;
  _observer;

  constructor() {
    this._eventObjects = [];
    this._observer = new PerformanceObserver((perfEntryList) => {
      const measures = perfEntryList.getEntriesByType('measure');
      measures.forEach((measure) => {
        this._eventObjects.push({
          name: measure.name,
          cat: measure.entryType,
          ph: "X",
          pid: 1,
          ts: Math.round(measure.startTime * 1000),
          dur: Math.round(measure.duration * 1000),
          args: measure.detail,
        });
      });
    });

    this._observer.observe({ type: 'measure', buffered: true });
  }

  destroy() {
    this._observer.disconnect();
  }

  getEvents() {
    return this._eventObjects;
  }
}

// Monkey patching require().
// Refs: https://stackoverflow.com/a/42883538
const Module = require('module');
const originalRequire = Module.prototype.require;

function trackRequires(shouldTrackRequires) {
  if (shouldTrackRequires) {
    Module.prototype.require = function () {
      const source = thisLine();
      performance.mark(`require("${arguments[0]}")`);
      const ret = originalRequire.apply(this, arguments);
      performance.measure(
        `require("${arguments[0]}")`,
        {
          detail: source,
          start: `require("${arguments[0]}")`,
        });
      return ret;
    };
  } else {
    Module.prototype.require = originalRequire;
  }
}

module.exports = {
  TraceEvents,
  trackRequires,
};
