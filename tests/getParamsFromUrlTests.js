const getParamsFromUrl = require("../server/getParamsFromUrl");

const expect = require("chai").expect;

describe("getParamsFromUrl", function()
{
  it("will extract the sequencial parameters from a url", function()
  {
    const url = "/localExpert/reviews/all";
    const route = "/localExpert/reviews/{1}";
    const results = getParamsFromUrl(url, route);

    expect(results.length).to.equal(1);
    expect(results[0]).to.equal("all");
  });

  it("will extract the named parameters from a url", function()
  {
    const url = "/localExpert/reviews/all";
    const route = "/localExpert/reviews/{type}";
    const results = getParamsFromUrl(url, route);

    expect(results["type"]).to.equal("all");
  });

  it("will extract the parameters from a url when not part of a route", function()
  {
    const url = "/localExpert/matthew/test";
    const route = "/localExpert";
    const results = getParamsFromUrl(url, route);

    expect(results.length).to.equal(2);
    expect(results[0]).to.equal("matthew");
    expect(results[1]).to.equal("test");
  });

  it("will not extract extra parameters from a url", function()
  {
    const url = "/localExpert/reviews/all/glory";
    const route = "/localExpert/reviews/{1}";
    const results = getParamsFromUrl(url, route);

    expect(results.length).to.equal(1);
    expect(results[0]).to.equal("all");
  });
});
