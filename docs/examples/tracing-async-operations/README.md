# Tracing async operations

A new `TraceEvents` object is created in:

https://github.com/RaisinTen/perftrace/blob/e9df1f8c4488a69c9051e8a62f0896ca7af677a6/docs/examples/tracing-async-operations/index.js#L6

Before the process exits, the `TraceEvents` object is destroyed and the trace events are stringified and printed to `events.json` in:

https://github.com/RaisinTen/perftrace/blob/e9df1f8c4488a69c9051e8a62f0896ca7af677a6/docs/examples/tracing-async-operations/index.js#L8-L12

The code that needs to be profiled can be done using the `peformance.measure()` and `peformance.mark()` APIs from [Node.js](https://nodejs.org/api/perf_hooks.html#performancemarkname-options) and the [Web](https://www.w3.org/TR/user-timing):

```js
peformance.mark("before");
// code that needs to be profiled
performance.measure("after", "before");
```

like it's being done in:

https://github.com/RaisinTen/perftrace/blob/e9df1f8c4488a69c9051e8a62f0896ca7af677a6/docs/examples/tracing-async-operations/index.js#L14-L26

After running `node .`, the generated `events.json` file can be opened on [https://ui.perfetto.dev](https://ui.perfetto.dev) for visualization:

TODO
