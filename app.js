// Require
const http = require("http");

// Server
const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(JSON.stringify({ message: "Hello World!" })));
  res.end();
});

// Listen
server.listen(9000, () => {
  console.log("Server running on Port 9000");
});
