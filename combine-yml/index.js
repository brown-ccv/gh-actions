const glob = require("@actions/glob");

const globber = glob.create("*/*.yml", {
  followSymbolicLinks: false
});
globber.glob().then(files => files.map(file => console.log(file)));
