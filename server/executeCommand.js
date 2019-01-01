const url = require("url");
const getParamsFromUrl = require("./getParamsFromUrl");

module.exports = async (request, command, bucket, config, queryCache) =>
{
  const body = await request.getJsonBody();
  const queryParams = url.parse(request.url, true).query;
  const routeParams = getParamsFromUrl(request.url, command.route);

  return command({
    body: body,
    userDetails: request.userDetails,
    config: config,
    bucket: bucket,
    routeParams: routeParams,
    queryParams: queryParams,
    queryCache: queryCache,
    require: require
  });
};
