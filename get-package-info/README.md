# get-package-info

This action takes in the path to a `package.json` and sets the following outputs:

* `package_version`: `version` field from the `package.json`
* `package_name`: `name` field from the `package.json`

It assumes that the following actions have been run:

* `actions/checkout`
* `actions/setup-node`

## Example `workflow.yml`

This workflow tests, build, and packages electron apps.  It uses the `package_name` and `package_version` to upload the correct artifacts to the GitHub action run.

```
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
        node-version: 12.x
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
    - name: package electron - linux
      if: startsWith(matrix.os, 'ubuntu')
      run: npm run package:linux
    - name: package electron - mac
      if: startsWith(matrix.os, 'mac')
      run: npm run package:mac
    - name: upload win-installer
      uses: actions/upload-artifact@master
      if: startsWith(matrix.os, 'windows')
      with:
        name: win-installer
        path: dist/installers/${{ steps.package_info.outputs.package_name }}-${{ steps.package_info.outputs.package_version }}-setup.exe
    - name: upload mac-installer
      uses: actions/upload-artifact@master
      if: startsWith(matrix.os, 'mac')
      with:
        name: mac-installer
        path: dist/${{ steps.package_info.outputs.package_name }}-${{ steps.package_info.outputs.package_version }}.dmg
    - name: upload linux-installer
      uses: actions/upload-artifact@master
      if: startsWith(matrix.os, 'ubuntu')
      with:
        name: linux-installer
        path: dist/installers/${{ steps.package_info.outputs.package_name }}_${{ steps.package_info.outputs.package_version }}_x64.deb
```
