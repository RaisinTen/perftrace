export class TraceEvents {
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
