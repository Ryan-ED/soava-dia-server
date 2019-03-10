const fs = require("fs");
const { N1qlQuery, Cluster } = require("couchbase");
const { QueryCache, CommandCache } = require("monkey-bars-db");
const { CouchbaseConnection, MangoParser, N1qlParser } = require("monkey-bars-db-couchbase");
const { configureEndpoints } = require("monkey-bars-server");

module.exports = function(config)
{
  const parsers = [new MangoParser(N1qlQuery), new N1qlParser(N1qlQuery)];

  const queryPaths = config.server.queryPaths.map(path => `${config.dirname}${path}`);
  const commandPaths = config.server.commandPaths.map(path => `${config.dirname}${path}`);

  const queryCache = new QueryCache(fs, queryPaths, parsers);
  const commandCache = new CommandCache(fs, commandPaths);

  // setting the modules for couchbase to use
  config.couchbase.modules = { N1qlQuery: N1qlQuery, Cluster: Cluster };
  const connection = CouchbaseConnection.createConnection(config.couchbase);
  const bucket = connection.openBucket(config.couchbase.defaultBucket);

  return configureEndpoints(config, queryCache, commandCache, bucket);
};
