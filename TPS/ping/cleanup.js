const fs = require("fs");

const time_regex = /time=([^\s]+)/g;

const file_string = fs.readFileSync("ping.txt", "utf-8");

const times = [...file_string.matchAll(time_regex)].map((e) =>
  parseFloat(e[0].replace("time=", ""))
);

fs.writeFile("times.js", "var times=" + JSON.stringify(times), (err) => {
  if (err) {
    console.error(err);
    return;
  }
});
