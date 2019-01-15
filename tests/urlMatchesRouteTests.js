const urlMatchesRoute = require("../server/urlMatchesRoute");

const expect = require("chai").expect;

describe("urlMatchesRoute", function()
{
  it("will compare two routes together", function()
  {
    const url = "/localExpert/reviews/all";
    const route = "/localExpert/reviews/{param}";
    const result = urlMatchesRoute(url, route);

    expect(result).to.equal(true);
  });

  it("will not match two routes together with extra params", function()
  {
    const url = "/localExpert/reviews/all/nothing";
    const route = "/localExpert/reviews/{param}";
    const result = urlMatchesRoute(url, route);

    expect(result).to.equal(false);
  });

  it("will match two routes together with many params", function()
  {
    const url = "/localExpert/reviews/latest/expert/matthew";
    const route = "/localExpert/reviews/{1}/expert/{2}";
    const result = urlMatchesRoute(url, route);

    expect(result).to.equal(true);
  });

  it("will match two routes together with route params", function()
  {
    const url = "/localExpert/reviews?latest=true&expert=matthew";
    const route = "/localExpert/reviews";
    const result = urlMatchesRoute(url, route);

    expect(result).to.equal(true);
  });

  it("will match two routes together with many many params", function()
  {
    const url = "/localExpert/reviews/latest/expert/matthew/place/durban/all";
    const route = "/localExpert/reviews/{1}/expert/{2}/place/{3}/all";
    const result = urlMatchesRoute(url, route);

    expect(result).to.equal(true);
  });

  it("will compare url with params", function()
  {
    const url = "/localExpert/reviews/all";
    const route = "/localExpert";
    const result = urlMatchesRoute(url, route);

    expect(result).to.equal(true);
  });

  it("will compare url with no params", function()
  {
    const url = "/localExpert/reviews";
    const route = "/localExpert/reviews";
    const result = urlMatchesRoute(url, route);

    expect(result).to.equal(true);
  });
});
