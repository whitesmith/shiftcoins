const commands = ["register", "balance"]

module.exports.commandParser = function(commandText) {
  let args = commandText.split(" ")
  if (args.length < 1) {
    return {command: "", params: ""}
  }

  let cmd = args[0]
  if (commands.indexOf(cmd) === -1) {
    return {command: "", params: ""}
  }

  return {
    command: cmd,
    params: args.slice(1),
  }
}
