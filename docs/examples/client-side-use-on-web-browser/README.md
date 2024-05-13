# Client-side use on Web Browser

A new `TraceEvents` object is created in:

TODO

Before the process exits, the `TraceEvents` object is destroyed and the trace events are stringified and printed to `events.json` in:

TODO

The `require()` calls can be tracked by passing `true` to `trackRequires()` like it is being done in:

TODO

After running `node .` and opening <http://localhost:3000> in your browser, the generated `events.json` file can be opened on <https://ui.perfetto.dev> for visualization:

![](./perfetto.png)
