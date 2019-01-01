const CouchQueryCache = require("../database/CouchQueryCache");

const expect = require("chai").expect;

describe("extractRoute", function()
{
  it("will process a route from a query file", function()
  {
    const cache = new CouchQueryCache();
    const result = cache.extractRoute(`/* route:/localExpert/reviews/all */
      SELECT 10;`);

    expect(result).to.equal("/localExpert/reviews/all");
  });
});
