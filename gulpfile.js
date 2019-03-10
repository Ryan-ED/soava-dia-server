const gulp = require("gulp");
const execa = require("execa");
const childProcess = require("child_process");
const config = require("./config.local.json");

const paths = {
  scripts: ["*.js", "**/*.js", "**/*.sql"],
};

gulp.task("docker-up", function()
{
  return execa("docker-compose", [`--file=${config.docker.composeFilePath}`, "up", "-d"]);
});

gulp.task("docker-down", function()
{
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
