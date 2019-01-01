const couchbase = require("couchbase");
const CouchbaseBucket = require("./CouchbaseBucket");

class CouchbaseConnection
{
  constructor(cluster)
  {
    this.cluster = cluster;
    this.bucketCache = new Map();
  }

  openBucket(bucketname)
  {
    if(!this.bucketCache.has(bucketname))
    {
      const bucket = this.cluster.openBucket(bucketname);

      this.bucketCache.set(bucketname, new CouchbaseBucket(bucket, couchbase.N1qlQuery));
    }
    
    return this.bucketCache.get(bucketname);
  }

  static createConnection({ serverUrl, username, password })
  {
    const cluster = new couchbase.Cluster(serverUrl);
    cluster.authenticate(username, password);
    return new CouchbaseConnection(cluster);
  }
}

module.exports = CouchbaseConnection;
