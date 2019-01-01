const fs = require("fs");
const couchbase = require("couchbase");

const CouchbaseConnection = require("./database/CouchbaseConnection");
const CouchQueryCache = require("./database/CouchQueryCache");
const CouchCommandCache = require("./database/CouchCommandCache");


const urlMatchesRoute = require("./server/urlMatchesRoute");
const executeQuery = require("./server/executeQuery");
const executeCommand = require("./server/executeCommand");

module.exports = function(config)
{
  const queryPaths = config.server.queryPaths.map(path => `${__dirname}${path}`);
  const commandPaths = config.server.commandPaths.map(path => `${__dirname}${path}`);

  const queryCache = new CouchQueryCache(fs, queryPaths, couchbase.N1qlQuery);
  const commandCache = new CouchCommandCache(fs, commandPaths);

  const connection = CouchbaseConnection.createConnection(config.couchbase);
  const bucket = connection.openBucket(config.couchbase.defaultBucket);

  const endpoints = [];

  const commands = commandCache.cacheAllCommands();
  const queries = queryCache.cacheAllQueries();

  for (const query of queries)
  {
      endpoints.push([(req) =>
      urlMatchesRoute(req.url, query.route),
      (req) => executeQuery(req, query, bucket)
    , query.isPublicQuery]);
  }

  for (const command of commands)
  {
      endpoints.push([(req) =>
        command.methods.includes(req.method) &&
      urlMatchesRoute(req.url, command.route), (request) =>
        executeCommand(request, command, bucket, config, queryCache)
    ,command.isPublicCommand]);
  }

  return endpoints;
};
