const util = require("util");

class CouchbaseBucket
{
  constructor(bucket, N1qlQuery)
  {
    this.bucket = bucket;
    this.N1qlQuery = N1qlQuery;

    this.replace = util.promisify(bucket.replace.bind(bucket));
    this.insert = util.promisify(bucket.insert.bind(bucket));
    this.upsert = util.promisify(bucket.upsert.bind(bucket));
    this.get = util.promisify(bucket.get.bind(bucket));
    this.remove = util.promisify(bucket.remove.bind(bucket));
    this.bucketQuery = util.promisify(bucket.query.bind(bucket));
  }

  disconnect()
  {
    this.bucket.disconnect();
  }

  query(query, parameters)
  {
    if(typeof query === "string")
    {
      query = this.N1qlQuery.fromString(query);
    }

    if(!Array.isArray(parameters))
    {
      parameters = Object.assign({}, parameters);
    }
    
    return this.bucketQuery(query, parameters);
  }
}

module.exports = CouchbaseBucket;
