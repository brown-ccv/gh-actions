# Check Wait Label

Checks PRs on a repo for a waiting label, and if found checks if the `wait_time` has passed.  If enough time has passed, remove the `wait_label` and add the `done_waiting_label`.  The calculation excludes weekend days from the wait time.

## Inputs

### `GITHUB_TOKEN`

**Required** `{{ secrets.GITHUB_TOKEN }}`

### `wait_label`

**Optional** name of label to look for in PRs. Default: `waiting`

### `wait_time`

**Required** Number of days the PR must have been open before marking the wait as done.

### `done_waiting_label`

**Optional** name of label to add to PR if done waiting. Default: `ready`

## Outputs

None

## Example `workflow.yml`

This workflow runs every 15 minutes on the default branch. It looks for PRs that have the label `4 day wait` and `2 day wait` and if they have waited 4 and 2 days respectively, changes the label to `ready`.

```
name: Check Wait Times

on:
  schedule:
    - cron:  '*/15 * * * *'
  push:
    branch:
      - chore-pr-comments # FOR TESTING

jobs:
  check:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v1
      with:
        node-version: 12.x
    - name: Check 4 day waits
      uses: brown-ccv/gh-actions/check-wait-label@master
      with:
        GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
        wait_label: "4 day wait"
        wait_time: 4
        done_waiting_label: ready
    - name: Check 2 day waits
      uses: brown-ccv/gh-actions/check-wait-label@master
      with:
        GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
        wait_label: "2 day wait"
        wait_time: 2
        done_waiting_label: ready
```
