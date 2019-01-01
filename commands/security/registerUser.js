module.exports = async function({ body, bucket, queryCache, require })
{
  const crypto = require("crypto");

  if(!body.email && !body.mobile)
  {
    throw new Error("No email address or mobile number provided");
  }

  if(!body.tokenType)
  {
    throw new Error("No token type specified");
  }

  if(!body.token)
  {
    throw new Error("No token or password provided");
  }

  const query = queryCache.findQuery("security/getExistingUser");

  const results = await bucket.query(query, {
    email: body.email,
    mobile: body.mobile || ""
  });

  if(results.length > 0)
  {
    const result = results[0];

    if(result.email === body.email)
    {
      throw new Error(`A user already existing with the ${result.email} email`);
    }

    if(result.mobile === body.mobile)
    {
      throw new Error(`A user already existing with the ${result.mobile} mobile number`);
    }

    throw new Error("A user already exists with email address or mobile number supplied");
  }

  let id = body.email || body.mobile;
  id = id.replace("@", "_").replace("+", "_");

  let tokenType = body.tokenType;
  let token = body.token;

  if(tokenType === "password")
  {
    token = crypto.createHash("md5").update(token).digest("hex");
  }

  const temp = {
    docType: "user",
    email: body.email,
  };

  const tempToken =
  {
    userId: id,
    docType: "userToken",
    tokenType: tokenType,
    token: token
  };

  await bucket.insert(id, temp);
  await bucket.insert(`${id}${tokenType}`, tempToken);

  return {
    userId: id,
    userTokenId: `${id}${tokenType}`
  };
};

module.exports.isPublicCommand = true;
module.exports.route = "/users/register";
