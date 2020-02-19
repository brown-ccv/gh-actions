const glob = require("@actions/glob");
const core = require("@actions/core");
const yaml = require("yaml");
const fs = require("fs");

const patterns = ["./apps/*.yml", "./software/*.yml", "./talks/*.yml"];
const globber = glob.create(patterns.join("\n"));

console.log(process.cwd());
fs.readdir(process.cwd(), (err, files) => {
  files.forEach(file => {
    console.log(file);
  });
});

globber.then(glob =>
  glob
    .glob()
    .then(arr => {
      let master = { apps: [], software: [], talks: [] };
      arr.map(path => {
        const category = path.split("/")[6];
        const file = fs.readFileSync(path, "utf8");
        master[path.split("/")[6]].push(yaml.parse(file));
      });
      fs.writeFileSync("file.json", JSON.stringify(master));
      console.log(master);
    })
    .catch(error => console.log(error))
);