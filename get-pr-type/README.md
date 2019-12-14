# Get PR Type

Given a PR, returns a pipe delimited string with the types of changes on that PR.  Assumes PR uses the following convention:
```
- [ ] :bug: Bug
- [ ] :dragon: Feature
- [ ] :frog: Data (data folder - people/opportunities)
- [ ] :dog: Content (content folder)
- [ ] :blowfish: Other. Specify:
```

## Inputs

### `GITHUB_TOKEN`

**Required** `{{ secrets.GITHUB_TOKEN }}`

## Outputs

### `change_types`

Example: `"|bug|content|"`

## Example `workflow.yml`

This workflow runs when a PR is made to the `develop` branch. It then adds the appropriate checklists, if checklists have not previously been added.

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
    - name: Comment on new PR
      uses: brown-ccv/gh-actions/comment-pr-checklist@master
      with:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
