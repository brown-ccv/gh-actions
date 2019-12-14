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

This workflow runs when a PR is made to the `develop` branch. It checks what type of changes the PR contains, then depending on that output, adds checklists to the PR (see `../comment-pr-checklist/`).

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
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v1
      with:
        node-version: 12.x
    - name: Get PR Change Types
      id: pr_type
      uses: brown-ccv/gh-actions/get-pr-type@master
      with:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    - name: Technical Comment PR
      uses: brown-ccv/gh-actions/comment-pr-checklist@master
      with:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        message_id: "Technical"
        message_file: '.github/tech_code_review.md'
    - name: Content 1 Comment on new PR
      if: contains(steps.pr_type.outputs.change_types, 'content') || contains(steps.pr_type.outputs.change_types, 'feature') || contains(steps.pr_type.outputs.change_types, 'other')
      uses: brown-ccv/gh-actions/comment-pr-checklist@master
      with:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        message_id: "Content 1"
        message_file: '.github/content_code_review.md'
    - name: Content 2 Comment on new PR
      if: contains(steps.pr_type.outputs.change_types, 'feature') || contains(steps.pr_type.outputs.change_types, 'other')
      uses: brown-ccv/gh-actions/comment-pr-checklist@master
      with:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        message_id: "Content 2"
        message_file: '.github/content_code_review.md'

```
