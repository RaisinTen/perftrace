# perftrace

Record [`PerformanceEntry`](https://w3c.github.io/performance-timeline/#dom-performanceentry) objects from [Node.js](https://nodejs.org/api/perf_hooks.html) and the [Web](https://w3c.github.io/performance-timeline) in the [Trace Event Format](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/preview), so that it can be visualized on [https://ui.perfetto.dev](https://ui.perfetto.dev).

## Example in [`example.js`](example.js)

A new `TraceEvents` object is created in:

https://github.com/RaisinTen/perftrace/blob/479fad048c63ce677a123bdd711c1bef8ba2b68e/example.js#L6

Before the process exits, the `TraceEvents` object is destroyed and the trace events are stringified and printed to `events.json` in:

https://github.com/RaisinTen/perftrace/blob/479fad048c63ce677a123bdd711c1bef8ba2b68e/example.js#L8-L12

The code that needs to be profiled can be done using the `peformance.measure()` and `peformance.mark()` APIs from [Node.js](https://nodejs.org/api/perf_hooks.html#performancemarkname-options) and the [Web](https://www.w3.org/TR/user-timing):

```js
peformance.mark("before");
// code that needs to be profiled
performance.measure("after", "before");
```

like it's being done in:

https://github.com/RaisinTen/perftrace/blob/479fad048c63ce677a123bdd711c1bef8ba2b68e/example.js#L14-L27

After running `node example.js`, the generated `events.json` file can be opened on [https://ui.perfetto.dev](https://ui.perfetto.dev) for visualization:
