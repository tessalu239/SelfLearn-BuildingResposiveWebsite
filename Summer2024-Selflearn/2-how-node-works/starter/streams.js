//Let say in our application, we need to read a large text file from the file system, and then send it to the client
const fs = require("fs");

const server = require("http").createServer();

server.on("request", (req, res) => {
  //Solution 1: Read the file synchron
  //Problem: Node has to load entire file into the memory before it can send it to the client, soon will run out resources -> node will quit working, everything will crash
  //So, just good for small files
  // fs.readFile("test-file.txt", (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data);
  // });
  //.
  //.
  //.
  //Solution 2: Streams
  //Problem: that out readable stream is much faster then the response stream, so the response stream is overwhelmed by the readable stream-> backpressure
  // const readable = fs.createReadStream("test-file.txt");
  // readable.on("data", (chunk) => {
  //   res.write(chunk);
  // });
  // readable.on("end", () => {
  //   res.end();
  // });
  // readable.on("error", (err) => {
  //   res.statusCode = 500;
  //   res.end("File not found");
  // });
  //.
  //.
  //.
  //Solution 3: pipe operator
  //Definition: pipe operator is a method that is available on all readable streams, and it is used to pipe the output of a readable stream into the input of a writable stream
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res);
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Server is listening on port 8000");
});
