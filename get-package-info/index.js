const core = require('@actions/core');
const path = require("node:path")
const process = require('node:process')

const pathInput = core.getInput('path', { required: true });
try {
  // Import package.json
  const fullPath = path.join(process.cwd(), pathInput)
  const pkg = require(fullPath)

  // Extract package name and version
  const packageVersion = pkg.version
  // TODO: Do we need to do this replace?
  const packageName = (process.platform === 'win32')
    ? pkg.name.replace('-', '_')
    : pkg.name
  
  // Set output variables
  core.setOutput('package_version', packageVersion)
  core.setOutput('package_name', packageName)

} catch (error) {
  core.setFailed(`Action failed with error ${error}`);
}