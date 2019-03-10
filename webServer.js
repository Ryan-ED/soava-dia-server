const configFilePath = process.argv[2] || "./config.local.json";
const config = require(configFilePath);

config.dirname = __dirname;

const http = require("http");
const configureEndpoints = require("./configureEndpoints");
const { ServerRequestHandler } = require("monkey-bars-server");

const handler = new ServerRequestHandler(configureEndpoints(config), config);
const server = http.createServer();

server.listen(config.server.defaultPort);

console.log("starting server at", config.server.defaultPort);

server.on("request", (req, res) =>
{
  handler.processRequest(req, res);
});
