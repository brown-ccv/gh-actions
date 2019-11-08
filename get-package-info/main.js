const core = require('@actions/core');
const path = require('path')

const path = core.getInput('path', { required: true });
const fullPath = path.join(process.cwd(), path)

const package = require(fullPath)

const package_version = package.version
const package_name = package.name

core.setOutput('package_version', package_version)
core.setOutput('package_name', package_name)
