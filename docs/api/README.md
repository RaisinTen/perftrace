## `TraceEvents`

### `constructor()`

Call `new TraceEvents()` to create a new `TraceEvents` object to track the `PerformanceEntry` objects.

### `destroy()`

Call `traceEvents.destroy()` when there is no more use of the `TraceEvents` object.

### `getEvents()`

Call `traceEvents.getEvents()` to get the PerformanceEntry objects in the [Trace Event Format](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/preview):

```json
[
  {
    "name": "B",
    "cat": "measure",
    "ph": "X",
    "pid": 1,
    "ts": 34509,
    "dur": 1004141,
    "args": null
  },
  {
    "name": "A",
    "cat": "measure",
    "ph": "X",
    "pid": 1,
    "ts": 33837,
    "dur": 2002098,
    "args": { "foo": "bar" }
  }
]
```

## `trackRequires(bool)` (only available in [CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules))

Call `trackRequires(true)` to enable tracking `require()`s and call `trackRequires(false)` to disable tracking `require()`s.
