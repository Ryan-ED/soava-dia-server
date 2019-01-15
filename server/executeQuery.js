const url = require("url");
const getParamsFromUrl = require("./getParamsFromUrl");

module.exports = async function(req, query, bucket)
{

  let currentUserId = null;

  if(!query.isPublicQuery)
  {
      currentUserId = req.userDetails._id;
  }

  const params = getParamsFromUrl(req.url, query.route);

  if(currentUserId)
  {
    if(params.push)
    {
      params.push(currentUserId);
    }
    else
    {
      params["currentUserId"] = currentUserId;
    }
  }

  let results = null;

  if(query.hasSequencialParameters)
  {
    results = await bucket.query(query, params);
  }
  else
  {
    if(params && !("length" in params))
    {
      results = await bucket.query(query, params);
    }
    else
    {
      const queryParams = url.parse(req.url, true).query;
      results = await bucket.query(query, queryParams);
    }
  }

  if(query.expectsSingleResult)
  {
    results = results[0];
    if(!results)
    {
      const error = new Error("Record not found");
      error.errorCode = 404;
      throw error;
    }
  }

  return results;
};
