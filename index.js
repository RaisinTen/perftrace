const { PerformanceObserver, performance } = require('node:perf_hooks');

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
          ph: "B",
          pid: 1,
          ts: Math.round(measure.startTime * 1000),
        });
        this._eventObjects.push({
          cat: measure.entryType,
          ph: "E",
          pid: 1,
          ts: Math.round((measure.startTime + measure.duration) * 1000),
        });
      });
    });

    this._observer.observe({ entryTypes: ['measure'], buffered: true });
  }

  destroy() {
    this._observer.disconnect();
  }

  getEvents() {
    return this._eventObjects;
  }
}

module.exports = { TraceEvents };