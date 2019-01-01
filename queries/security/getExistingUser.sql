/* singleResult */
/* hidden */

SELECT meta(currentUser).id as _id,
      currentUser.email,
      currentUser.mobile
FROM zytso currentUser
WHERE currentUser.docType = "user"
AND (currentUser.email = $email OR currentUser.mobile = $mobile);
