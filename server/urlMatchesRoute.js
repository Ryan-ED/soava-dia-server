module.exports = function(url, route)
{
  const splitUrl = url.split("/");
  const splitRoute = route.split("/");
  let result = false;

  let parameterCount = 0;

  if(route.includes("{") && route.includes("}"))
  {
    parameterCount = splitRoute.filter(x => x.includes("{")).length;
  }

    for (let i = 0; i < splitUrl.length; ++i)
    {
      if(splitUrl[i] === splitRoute[i] ||
        splitRoute[i] === undefined ||
        (splitRoute[i] && splitRoute[i].startsWith("{") && splitRoute[i].endsWith("}")))
      {
        if(parameterCount > 0 && splitRoute[i] === undefined)
        {
          result = false;
          break;
        }
        else
        {
          result = true;
          continue;
        }
      }
      else
      {
        result = false;
        break;
      }
    }

  return result;
};
