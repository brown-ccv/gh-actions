const core = require('@actions/core');
const path = require("node:path")
const process = require('node:process')

// TODO: Use a try/catch block

// Get full package to package.json
const pathInput = core.getInput('path', { required: true });
const fullPath = path.join(process.cwd(), pathInput)

// Import package and extract details
const pkg = require(fullPath)
const packageVersion = pkg.version
// TODO: Do we need to do this replace?
const packageName = (process.platform === 'win32')
  ? pkg.name.replace('-', '_')
  : pkg.name

// Set output variables
core.setOutput('package_version', packageVersion)
core.setOutput('package_name', packageName)
