const core = require('@actions/core');

const path = core.getInput('path', { required: true });

try {
  const package = require(path)

  const package_version = package.version
  const package_name = package.name

  core.setOutput('package_version', package_version)
  core.setOutput('package_name', package_name)
} catch {
  console.log(process.cwd())
}
