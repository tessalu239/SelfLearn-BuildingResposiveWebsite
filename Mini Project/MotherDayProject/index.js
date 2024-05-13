const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./js/replaceTemplate");

const tempHome = fs.readFileSync(`${__dirname}/template/home.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url, true);
  if (pathname === "/home" || pathname === "/") {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(tempHome);
  } else {
    res.end("Hello");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
