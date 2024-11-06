const { PerformanceObserver, performance } = require('node:perf_hooks');

function getSource() {
  const error = new Error();
  const stack = error.stack.split("\n");
  // Ignore the first 3 elements of the error stack to get the relevant source:
  // Error
  //     at getSource (.../perftrace/index.cjs:...:...)
  //     at Module.require (.../perftrace/index.cjs:...:...)
  //     ...
  const source = stack.slice(3);
  return source;
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

function trackRequires(shouldTrackRequires, options) {
  if (shouldTrackRequires) {
    Module.prototype.require = function () {
      let source = null;
      if (options?.trackSource) {
        source = getSource();
      }
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
