import { TraceEvents } from "./perftrace.mjs";

performance.mark("begin tracing");
const traceEvents = new TraceEvents();

const listItems = [];
let submissionDiv;
const NUM_ELEMENTS = 8;

function fetchDataId(id) {
  performance.mark(`before fetching data ${id}`);
  return fetch(`/api/data${id}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      listItems[id].innerHTML = "";
      const p = document.createElement("p");
      p.className = "data";
      p.innerText = data.text;
      listItems[id].appendChild(p);
      performance.measure(`fetch data ${id}`, `before fetching data ${id}`);
    });
}

async function fetchData() {
  const dataFetches = [];
  for (let i = 0; i < NUM_ELEMENTS; ++i) {
    dataFetches.push(fetchDataId(i));
  }
  await Promise.all(dataFetches);
}

function showLoaders() {
  const ul = document.createElement("ul");
  for (let i = 0; i < NUM_ELEMENTS; ++i) {
    const div = document.createElement("div");
    div.className = "loader";
    const li = document.createElement("li");
    listItems.push(li);
    li.appendChild(div);
    ul.appendChild(li);
  }
  document.body.appendChild(ul);
}

function submitTrace() {
  submissionDiv.innerHTML = "";
  const events = traceEvents.getEvents();
  traceEvents.destroy();

  // post events to /api/perftrace
  fetch("/api/perftrace", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(events)
  });
}

async function displayButton() {
  performance.mark("creating submit button");
  const fetchData = await fetch("/api/submit");
  const fetchJson = await fetchData.json();
  const data = fetchJson.data;
  submissionDiv = document.createElement("div");
  const button = document.createElement("button");
  button.className = "submit";
  button.textContent = data;
  button.type = "button";
  button.onclick = submitTrace;
  submissionDiv.appendChild(button);
  document.body.appendChild(submissionDiv);
  performance.measure("create submit button", "creating submit button");
  performance.measure("tracing", "begin tracing");
}

showLoaders();
await fetchData();
displayButton();
