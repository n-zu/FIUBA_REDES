// import times from "./times.js";

const bin_size = 0.5;

const trace = {
  x: times,
  type: "histogram",
  xbins: {
    end: 20,
    size: bin_size,
    start: 0,
  },
};

const data = [trace];

const layout = {
  autosize: true,
  width: 1000,
  height: 500,
  yaxis: {
    title: `Count (${times.length})`,
  },
  xaxis: {
    title: "RTT (ms)",
  },
};

Plotly.newPlot("graph", [trace], layout);

const log_trace = {
  x: times,
  type: "histogram",
  xbins: {
    end: 30,
    size: bin_size,
    start: 0,
  },
};

const log_layout = {
  autosize: true,
  width: 1000,
  height: 500,
  yaxis: {
    title: `Count (${times.length})`,
    type: "log",
  },
  xaxis: {
    title: "RTT (ms)",
  },
};

Plotly.newPlot("log_graph", [log_trace], log_layout);

const log_trace2 = {
  x: times,
  type: "histogram",
  xbins: {
    end: 100,
    size: bin_size,
    start: 0,
  },
};

Plotly.newPlot("log_graph2", [log_trace2], log_layout);

const loglog_trace = {
  x: times,
  type: "histogram",
  xbins: {
    end: 30,
    size: bin_size,
    start: 0,
  },
};

const loglog_layout = {
  autosize: true,
  width: 1000,
  height: 500,
  yaxis: {
    title: `Count (${times.length})`,
    type: "log",
  },
  xaxis: {
    title: "RTT (ms)",
    type: "log",
  },
};

Plotly.newPlot("loglog_graph", [loglog_trace], loglog_layout);

const time_trace = {
  y: times,
  x: times.map((_, i) => i),
  type: "scatter",
};

const time_layout = {
  autosize: true,
  width: 1000,
  height: 500,
  yaxis: {
    title: `RTT (ms)`,
  },
  xaxis: {
    title: "t (3hs)",
  },
};

Plotly.newPlot("time", [time_trace], time_layout);
