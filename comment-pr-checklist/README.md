# Comment on PR

Adds a Code Review Checklist (or any MarkDown file) as a comment to a PR.

## Inputs

### `GITHUB_TOKEN`

**Required** `{{ secrets.GITHUB_TOKEN }}`

### `message_file`

**Required** path to the file that should be added as a comment to the PR

### `message_id`

**Optional** a string identifier to add as a comment on the message.  Only one message with a given `message_id` will be posted to a PR.  If you are using this action multiple times within a workflow, it is recommended to customize the `message_id`.  Default is `"Default"`.

## Outputs

None

## Example `workflow.yml`

This workflow runs when a PR is made to the `develop` branch.  It then adds the appropriate checklists, if checklists have not previously been added.

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
