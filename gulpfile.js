const gulp = require("gulp");
const execa = require("execa");
const childProcess = require("child_process");
const config = require("./config.local.json");

const paths = {
  scripts: ["*.js", "**/*.js", "**/*.sql"],
};

gulp.task("docker-pull", async function()
{
  console.log("docker", ...["pull" , "couchbase/server:community"]);
  await execa("docker", ["pull" , "couchbase/server:community"]).then(output =>
  {
    if (output.stdout)
    {
      console.info(output.stdout);
    }

    if (output.stderr)
    {
      console.error(output.stderr);
    }
  });
});

gulp.task("docker-up", function()
{
  console.log("docker-compose", ...[`--file=${config.docker.composeFilePath}`, "up", "-d"]);
  return execa("docker-compose", [`--file=${config.docker.composeFilePath}`, "up", "-d"]);
});

gulp.task("docker-down", function()
{
  console.log("docker-compose", ...[`--file=${config.docker.composeFilePath}`, "down"]);
  return execa("docker-compose", [`--file=${config.docker.composeFilePath}`, "down"]);
});


gulp.task("serve", ["docker-up"], function()
{
  let server = childProcess.fork("webServer.js");

  gulp.watch(paths.scripts, () =>
  {
    console.info("Restarting server");
    server.kill();

    server = childProcess.fork("webServer.js");
  });
});
