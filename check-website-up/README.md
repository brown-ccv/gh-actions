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
