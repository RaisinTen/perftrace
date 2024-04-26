# Tracing async operations

A new `TraceEvents` object is created in:

TODO

Before the process exits, the `TraceEvents` object is destroyed and the trace events are stringified and printed to `events.json` in:

TODO

The code that needs to be profiled can be done using the `peformance.measure()` and `peformance.mark()` APIs from [Node.js](https://nodejs.org/api/perf_hooks.html#performancemarkname-options) and the [Web](https://www.w3.org/TR/user-timing):

```js
peformance.mark("before");
// code that needs to be profiled
performance.measure("after", "before");
```

like it's being done in:

TODO

After running `node .`, the generated `events.json` file can be opened on [https://ui.perfetto.dev](https://ui.perfetto.dev) for visualization:

TODO
