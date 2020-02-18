const core = require("@actions/core");
const glob = require("@actions/glob");

const globOptions = {
  followSymbolicLinks:
    core.getInput("follow-symbolic-links").toUpper() !== "FALSE"
};
const globber = glob.create(core.getInput("files"), globOptions);
globber.globGenerator().then(files => files.map(file => console.log(file)));
