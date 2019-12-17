# Comment on PR

Adds Code Review Checklist Comments to a PR.  Currently designed to work specifically with ccv-website

## Inputs

### `GITHUB_TOKEN`

**Required** `{{ secrets.GITHUB_TOKEN }}`

## Outputs

None

## Example `workflow.yml`

This workflow runs when a PR is made to the `develop` branch. It then adds the checklist file, if a commend with this `message_id` has not previously been added.

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
        message_id: 'checklist'
        message_file: 'default_comment.md'
```
