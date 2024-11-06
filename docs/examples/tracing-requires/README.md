# Tracing `require()`s

A new `TraceEvents` object is created in:

https://github.com/RaisinTen/perftrace/blob/7cb1ce34d19ed8816e15094b3ef4fd03bb157c76/docs/examples/tracing-requires/index.js#L4

Before the process exits, the `TraceEvents` object is destroyed and the trace events are stringified and printed to `events.json` in:

https://github.com/RaisinTen/perftrace/blob/7cb1ce34d19ed8816e15094b3ef4fd03bb157c76/docs/examples/tracing-requires/index.js#L6-L10

The `require()` calls can be tracked by calling `trackRequires()` like it is being done in:

https://github.com/RaisinTen/perftrace/blob/2368914c05fa8a18d0838568c1b2906fccd5be79/docs/examples/tracing-requires/index.js#L12

After running `npm ci`, run `node .` and open <http://localhost:3000> in your browser. The generated `events.json` file can be opened on <https://ui.perfetto.dev> for visualization:

![](./perfetto.png)
