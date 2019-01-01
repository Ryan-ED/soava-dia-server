class CouchQueryCache
{
  constructor(fs, queryPaths, N1qlQuery)
  {
    this.fs = fs;
    this.queryPaths = typeof queryPaths === "string" ?  [ queryPaths ] : queryPaths;
    this.N1qlQuery = N1qlQuery;
    this.queryCache = new Map();
    this.getAllQueryPaths = this.getAllQueryPaths.bind(this);
    this.cacheAllQueries = this.cacheAllQueries.bind(this);
    this.getQuery = this.getQuery.bind(this);
  }


  getAllQueryPaths()
  {
    const directories = [];

    for (const path of this.queryPaths)
    {
      directories.push(...this.fs.readdirSync(path).map(x => `${path}/${x}`));
    }

    return directories
        .filter(x => x.endsWith(".sql"));
  }

  findQuery(queryName)
  {
    const queryPath = [...this.queryCache.keys()].find(x => x.includes(queryName));

    if(!queryPath)
    {
      throw new Error("Query not found in cache");
    }

    return this.queryCache.get(queryPath);
  }

  cacheAllQueries()
  {
    const queries = this.getAllQueryPaths();

    return queries.map(this.getQuery);
  }

  extractRoute(query)
  {
    const routeStartIndex = query.indexOf("/* route:");

    if(routeStartIndex != -1)
    {
      const routeEndIndex = query.indexOf("*/", routeStartIndex);
      let route = query.substring(routeStartIndex, routeEndIndex) || "";
      route = route.replace("/* route:", "").replace("*/").trim();

      if(route.indexOf("/") != 0)
      {
        route = `/${route}`;
      }

      return route;
    }
  }

  getQuery(queryPath)
  {
    const queryName = queryPath.split("/").pop().replace(".sql", "");

    if(this.queryCache.has(queryPath))
    {
      return this.queryCache.get(queryPath);
    }

    const fileContents = this.fs.readFileSync(queryPath);
    const queryAsString = fileContents.toString();

    const query = this.N1qlQuery.fromString(queryAsString);
    query.isAdhoc = false;
    query.hasSequencialParameters = queryAsString.includes("$1");
    query.expectsSingleResult = queryAsString.includes("/* singleResult */");
    query.isPublicQuery = queryAsString.includes("/* publicQuery */");

    query.route = this.extractRoute(queryAsString) || `/${queryName}`;

    this.queryCache.set(queryPath, query);

    return query;
  }
}

module.exports = CouchQueryCache;
