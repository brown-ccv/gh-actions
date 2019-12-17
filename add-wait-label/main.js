const core = require('@actions/core');
const { context, GitHub } = require('@actions/github');
const { getPrBody, applyLabel, removeLabel } = require("./utils");

async function run() {
  try {
    const repo = context.repo;
    const number = context.payload.pull_request.number;
    const githubToken = core.getInput("GITHUB_TOKEN", {required: true});
    const waitTime = parseInt(core.getInput("wait_time", {required: true}))
    const waitLabel = core.getInput("wait_label")
    const doneLabel = core.getInput("done_waiting_label")

    if (!number) {
      core.setFailed("This action only works for pull_request");
      return;
    }

    const octokit = new GitHub(githubToken);

    const prTime = await getPrTime(octokit, repo, number)
    const nowTime = Date.now()
    const timeWaited = (nowTime - prTime) / 24 / 60 / 60 / 1000

    if (timeWaited - waitTime >= 0) {
      applyLabel(octokit, repo, number, doneLabel)
      removeLabel(octokit, repo, number, waitLabel)
    } else {
      removeLabel(octokit, repo, number, doneLabel) // just in case
      applyLabel(octokit, repo, number, waitLabel)
    }

  } catch ({ message }) {
    core.setFailed(message);
  }
}

run();
