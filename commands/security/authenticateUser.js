module.exports = async function({ body, bucket, config, queryCache, require })
{
  const crypto = require("crypto");
  const jwt = require("jsonwebtoken");

  if(!body.username)
  {
    body.username = body.email || body.mobile;
  }

  if(body.tokenType === "password")
  {
    body.token = crypto.createHash("md5").update(body.token).digest("hex");
  }

  const userQuery = queryCache.findQuery("security/getCurrentUser");

  const results = await bucket.query(userQuery, body);

  if(results.length == 1)
  {
    const userDetails = results[0];
    if(userDetails.matchingTokens &&
      userDetails.matchingTokens[0])
      {
        delete userDetails.matchingTokens;

        userDetails.tokenType = body.tokenType;

        const token = jwt.sign(userDetails, config.server.privateKey);
        userDetails.jwtToken = token;

        return userDetails;
      }
      else
      {
        throw new Error("The user details provided did not match any user");
      }
  }
  else
  {
    throw new Error("The user details provided did not match any user");
  }
};

module.exports.isPublicCommand = true;
module.exports.route = "/users/authenticate";
