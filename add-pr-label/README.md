# Add PR Label

Add a label to a Pull Request

## Inputs

### `GITHUB_TOKEN`

**Required** `{{ secrets.GITHUB_TOKEN }}`

### `label`

**Required** name of label to add to PR

## Outputs

None

## Example `workflow.yml`

This workflow runs when a PR is made to the `develop` branch. It then adds the `waiting` label.

```
name: PR Commenter

on:
  pull_request:
    branch:
      - develop

jobs:
  comment:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js
      uses: actions/setup-node@v1
      with:
        node-version: 12.x
    - name: Label PR
      uses: brown-ccv/gh-actions/add-pr-label@master
      with:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        label: 'waiting'
```
