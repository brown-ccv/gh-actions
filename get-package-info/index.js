const core = require("@actions/core");
const path = require("node:path");
const process = require("node:process");

try {
  const pathInput = core.getInput("path", { required: true });

  // Import package.json and extract details
  const fullPath = path.join(process.cwd(), pathInput);
  const { name, version } = require(fullPath);

  // Set output variables
  core.setOutput("package_version", version);
  core.setOutput("package_name", name);
} catch (error) {
  core.setFailed(`Action failed with error ${error}`);
}
