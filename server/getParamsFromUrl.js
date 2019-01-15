module.exports = function(url, route)
{
  const splitUrl = url.split("/");
  const splitRoute = route.split("/");
  let parameterCount = 0;
  let hasNamedParameters = false;
  let potentialParameters = ["{1}", "{2}", "{3}", "{4}", "{5}", "{6}", "{7}", "{8}", "{9}"];
  let results = [];


  if(route.includes("{") && route.includes("}") &&
  !splitRoute.some(x => potentialParameters.includes(x)))
  {
    hasNamedParameters = true;
    results = {};
  }

  if(route.includes("{") && route.includes("}"))
  {
    parameterCount = splitRoute.filter(x => x.includes("{")).length;
  }

    for (let i = 0; i < splitUrl.length; ++i)
    {
      let length = results.length || Object.keys(results).length;

      if(splitRoute[i] === undefined ||
        (splitRoute[i].startsWith("{") && splitRoute[i].endsWith("}")))
      {
        if(!parameterCount)
        {
          if(hasNamedParameters)
          {
            results[splitRoute[i].replace("{", "").replace("}", "")] = splitUrl[i];
          }
          else
          {
            results.push(splitUrl[i]);
          }
        }
        else if(length < parameterCount)
        {
          if(hasNamedParameters)
          {
            results[splitRoute[i].replace("{", "").replace("}", "")] = splitUrl[i];
          }
          else
          {
            results.push(splitUrl[i]);
          }
        }
      }

      if(splitUrl[i] === splitRoute[i])
      {
        continue;
      }
    }

  return results;
};
