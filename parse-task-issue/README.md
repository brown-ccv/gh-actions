# Parse Task Issue Template

Given an Issue, returns a string with the details of the task. 

## Inputs

### `GITHUB_TOKEN`

**Required** `{{ secrets.GITHUB_TOKEN }}`

## Outputs

### `file_content`

Example: `"taskName: null
          links:
            deployment: 'https://example.com'
            sourceCode: 'https://github.com/example/task'
          framework:
            library: LIBRARY
            language: LANGUAGE
          lab:
            name: null
            institution: null
            principalInvestigator: null
            developers:
              - DEVELOPER_1
              - DEVELOPER_2
            website: 'https://example.com'
          publication:
            doi: 'doi:###/###.###'
            url: 'https://example.com'
          platform:
            desktop:
              windows: true
              linux: true
              mac: false
            mobile:
              ios: false
              android: false
          features:
            electron: false
            browser: true
            docker: false
            eegTrigger: true
            mturk: true
          tags:
            - TAG_1
            - TAG_2
            - TAG_3
            - TAG_4"`

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
