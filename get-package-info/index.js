const core = require('@actions/core');
const path = require('path')

const filePath = core.getInput('path', { required: true });
const fullPath = path.join(process.cwd(), filePath)

const pkg = require(fullPath)

const packageVersion = pkg.version
const packageName = (process.platform === 'win32')
  ? pkg.name.replace('-', '_')
  : pkg.name

core.setOutput('package_version', packageVersion)
core.setOutput('package_name', packageName)
