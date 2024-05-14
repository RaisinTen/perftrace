# perftrace

Record [`PerformanceEntry`](https://w3c.github.io/performance-timeline/#dom-performanceentry) objects from [Node.js](https://nodejs.org/api/perf_hooks.html) and the [Web](https://w3c.github.io/performance-timeline) in the [Trace Event Format](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/preview), so that it can be visualized on <https://ui.perfetto.dev> like this!

![](./docs/examples/tracing-requires/perfetto.png)

The code for this example is available [here](docs/examples/tracing-requires).

![](./docs/examples/client-side-use-on-web-browser/perftrace-web.gif)

The code for this example is available [here](docs/examples/client-side-use-on-web-browser).

Check out <a href="https://dev.to/raisinten/visualize-performance-issues-in-your-javascript-application-4cnc">the blog <img src="https://avatars2.githubusercontent.com/u/13521919?s=200&v=4" width="25px"></a>!

## Install

```
npm i perftrace
```

## Usage

Check out the [API documentation](docs/api) and the [code examples](docs/examples).

## License

This project is available under the [MIT license](https://opensource.org/license/MIT). See [LICENSE](LICENSE) for the full license text.
