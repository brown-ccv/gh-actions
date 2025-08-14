# check-website-up

Checks if a url is responsive and returns a non-error status code.  If it doesn't, open or update an issue with the error.  If it is, check if there's an issue to close from a previous error.



## Inputs

### `github_token`

**Required** `{{ secrets.GITHUB_TOKEN }}`

### `website`

**Required** A url for a website to check

## Example `workflow.yml`

This workflow runs every 6 hours to check if the websites in the `strategy.matrix` are up.

```
name: Check Website Up

on:
  schedule:
    - cron: '0 */6 * * *'

jobs:
  check:
    runs-on: ubuntu-latest
    continue-on-error: true

    strategy:
      matrix:
        website:
          - https://google.com
          - https://github.com

    steps:
      - name: Check if website is up
        uses: brown-ccv/gh-actions/check-website-up@main
        with:
          website: ${{ matrix.website }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
```


If your Slack Channel has registered an incoming webhook, you can optionally pass that along to the this action in order to receive a Slack alert in your team's channel. Your incoming webhook must be registered as a secret in your GitHub repo. 

Note:  If your site runs behind Brown's firewall, you will need to deploy the action on a self-hosted runner. 

## Example `workflow.yml`

```yaml
name: "Monitor QA / PROD XNAT"

on:
  schedule:
    - cron: '*/10 * * * *'  
  workflow_dispatch:

jobs:
  check:
    runs-on: self-hosted
    strategy:
      matrix:
        url: ["https://xnat.bnc.brown.edu", "https://qa-xnat.bnc.brown.edu"]
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Check ${{ matrix.url }}
        uses: brown-ccv/gh-actions/check-website-up@main
        with:
          website: ${{ matrix.url }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
          slack_webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```