const jwt = require("jsonwebtoken");
const url = require("url");

class ServerRequestHandler
{
  constructor(methods, config)
  {
    this.methods = methods;
    this.config = config;
  }

  static getJsonBody(request)
  {
    return new Promise((resolve, reject) =>
  {
    let body = "";
    request.on("data", chunk => {
          body += chunk.toString();
      });
    request.on("end", () => {
          try
          {
            const result = JSON.parse(body || "{}");
            resolve(result);
          }
          catch(ex)
          {
            reject(ex);
          }
      });
  });
  }

  async wrapRequest(req, res, executor, isPublic)
  {
      isPublic = isPublic || false;
      let userDetails = null;
      try
      {
        if(!isPublic)
        {
          let bearerToken = req.headers.authorization;

          if(!bearerToken)
          {
            const queryParams = url.parse(req.url, true).query;
            bearerToken = queryParams.authorization;
          }

          if(!bearerToken)
          {
            const error = new Error("Request does not have authorization header");
            error.errorCode = 401;
            throw error;
          }

          if(bearerToken && !bearerToken.startsWith("Bearer"))
          {
            const error = new Error("Request auth header is not Bearer");
            error.errorCode = 401;
            throw error;
          }

          bearerToken = bearerToken.replace("Bearer ", "");
          userDetails = jwt.verify(bearerToken, this.config.server.privateKey);
        }

        req.userDetails = userDetails;

          let results = await Promise.race([executor(req, res), new Promise(function(resolve, reject) {
          setTimeout(reject, 10000, "The request timed out");
        })]);

        if(!(results && results.pipe))
        {
          if(typeof results != "string")
          {
            results = JSON.stringify(results);
          }

            res.writeHead(200, {
              "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"});
            res.write(results || "{ \"result\": \"ok\" }");
            res.end();
        }
      }
      catch(ex)
      {
        res.writeHead(ex.errorCode || 400, {
          "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"});
        res.write(JSON.stringify({ error: ex.message }));
        res.end();
      }
  }

  processRequest(request, response)
  {
      const handler = this.methods
                            .find(x => x[0](request));

      if(handler)
      {
        const wrappedRequest = {
          url: request.url,
          method: request.method,
          headers: request.headers,
          getJsonBody: () => ServerRequestHandler.getJsonBody(request)
        };

        this.wrapRequest(wrappedRequest, response, (someRequest, someResponse) => handler[1](someRequest, someResponse), handler[2]);
      }
      else
      {
        response.writeHead(404, {
          "Content-Type": "application/json"});
        response.end();
      }
    }
}


module.exports = ServerRequestHandler;
