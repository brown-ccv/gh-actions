# Parse Task Issue Template

Given an Issue, returns a string with the details of the task. 

## Inputs

### `GITHUB_TOKEN`

**Required** `{{ secrets.GITHUB_TOKEN }}`

## Outputs

### `file_content`

Example: `"taskName: optio
          links:
            deployment: http://lorna.net
            sourceCode: https://github.com/laborum/sunt
          framework:
            library: React JS
            language: JavaScript
          lab:
            name: enim Lab
            institution: Stanton - Hauck
            principalInvestigator: Dr. Ransom Jacobi
            developers:
              - Armand Volkman
              - Susie Zulauf
            website: http://jacklyn.com
          publication:
            doi: doi:e44d2533/02b5.44a2
            url: https://rickey.info
          platform:
            desktop:
              windows: false
              linux: false
              mac: true
            mobile:
              ios: false
              android: true
          features:
            electron: false
            browser: false
            docker: false
            eegTrigger: false
            mturk: true
          tags:
            - iusto
            - odit
            - quisquam
            - provident"`

## Example `workflow.yml`

This workflow runs when an Issue is created. It checks the label of the issue, and accordingly sets the output as the file content for data request.

```
name: Task Issue Parser

on:
  issues: {types: opened}


jobs:
  comment:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v1
      with:
        node-version: 12.x
    - name: Parse Task Issue
      id: issue_parser
      uses: brown-ccv/gh-actions/parse-task-issue@master
      with:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

```
