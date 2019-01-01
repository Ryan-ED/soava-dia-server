/* hidden */

SELECT meta(currentUser).id as _id,
      currentUser.email,
      currentUser.mobile,
      currentUser.localExpertRegistrationDate,
  (SELECT RAW meta(userToken).id FROM zytso userToken
    USE KEYS (SELECT RAW meta().id FROM zytso
      WHERE zytso.docType = "userToken"
      AND zytso.tokenType = $tokenType
      AND zytso.token = $token)
    WHERE userToken.userId = meta(currentUser).id) AS matchingTokens
FROM zytso currentUser
WHERE currentUser.docType = "user"
AND (currentUser.email = $username OR currentUser.mobile = $username);
