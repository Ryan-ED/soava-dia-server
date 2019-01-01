class CommandCache
{
  constructor(fs, commandPaths)
  {
    this.fs = fs;
    this.commandPaths = typeof commandPaths === "string" ?  [ commandPaths ] : commandPaths;
    this.commandCache = new Map();
    this.getCommand = this.getCommand.bind(this);
    this.getAllCommandPaths = this.getAllCommandPaths.bind(this);
    this.cacheAllCommands = this.cacheAllCommands.bind(this);
  }

  getAllCommandPaths()
  {
    const directories = [];

    for (const path of this.commandPaths)
    {
      directories.push(...this.fs.readdirSync(path).map(x => `${path}/${x}`));
    }

    return directories
        .filter(x => x.endsWith(".js"));
  }

  cacheAllCommands()
  {
    const queries = this.getAllCommandPaths();

    return queries.map(this.getCommand);
  }

  getCommand(commandPath)
  {
    const commandName = commandPath.split("/").pop().replace(".js", "");

    if(this.commandCache.has(commandPath))
    {
      return this.commandCache.get(commandPath);
    }

    const command = require(commandPath);
    command.route = command.route || `/${commandName}`;
    command.methods = command.methods || ["POST"];
    command.isPublicCommand = command.isPublicCommand || false;

    this.commandCache.set(commandPath, command);

    return command;
  }
}

module.exports = CommandCache;
