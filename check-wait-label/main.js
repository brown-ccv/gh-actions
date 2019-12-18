const core = require('@actions/core');
const { context, GitHub } = require('@actions/github');
const { getPrTime, applyLabel, removeLabel, getPrIds, getWeekendDaysCount } = require("./utils");

async function run() {
  try {
    const repo = context.repo;
    const githubToken = core.getInput("GITHUB_TOKEN", {required: true});
    const waitTime = parseInt(core.getInput("wait_time", {required: true}))
    const waitLabel = core.getInput("wait_label")
    const doneLabel = core.getInput("done_waiting_label")

    const octokit = new GitHub(githubToken)

    const prs = await getPrIds(octokit, repo, waitLabel)

    for (const i in prs) {
      let number = prs[i]
      let prTime = await getPrTime(octokit, repo, number)
      let nowTime = new Date(Date.now())
      let timeElapsed = (nowTime - prTime) / 24 / 60 / 60 / 1000
      let numWeekend = getWeekendDaysCount(prTime, nowTime)
      let timeWaited = timeElapsed - numWeekend

      if (timeWaited - waitTime >= 0) {
        await applyLabel(octokit, repo, number, doneLabel)
        await removeLabel(octokit, repo, number, waitLabel)
      }
    }

  } catch ({ message }) {
    core.setFailed(message);
  }
}

run();
