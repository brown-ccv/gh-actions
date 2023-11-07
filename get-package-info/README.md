# Get Package Info

Gets the package name and version from a `package.json` file

## Inputs

### `path`

**Required** The path of the `package.json`. Default `./package.json`.

## Outputs

### `package_name`

The name of the package from the `name` field.

### `package_version`

The version of the package from the `version` field.


## Example `workflow.yml`

This workflow tests, build, and packages electron apps.  It uses the `package_name` and `package_version` to upload the correct artifacts to the GitHub action run.

```yaml
name: Upload package installer to artifacts

on:
  push:
    branches:
      - master
      - develop

jobs:
  build:

    runs-on: ${{ matrix.os }}

    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, macOS-latest, windows-latest]

    steps:
    - uses: actions/checkout@v1
    - name: Use Node.js
      uses: actions/setup-node@v1
      with:
        node-version: 18.x
    - name: Set package version and name
      uses: ./.github/actions/get-package-info
      id: package_info
      with:
        path: ../../../package.json
        
    - name: npm install
      run: npm install
    - name: npm build
      run: npm run build
    - name: npm test
      run: npm test
      env:
        CI: true
        
    - name: package electron - windows
      if: startsWith(matrix.os, 'windows')
      run: npm run package:windows
    - name: upload win-installer
      uses: actions/upload-artifact@master
      if: startsWith(matrix.os, 'windows')
      with:
        name: win-installer
        path: dist/installers/${{ steps.package_info.outputs.package_name }}-${{ steps.package_info.outputs.package_version }}-setup.exe
```
