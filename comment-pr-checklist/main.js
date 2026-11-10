const core = require('@actions/core');
const { findPreviousComment, createComment, findFirstComment, getCommentTypes } = require("./comments");

async function run() {
  try {
    const { context, getOctokit } = await import('@actions/github');
    const repo = context.repo;
    const number = context.payload.pull_request.number;
    const githubToken = core.getInput("GITHUB_TOKEN", {required: true});
    const messageFile = core.getInput("message_file", {required: true});
    const messageId = core.getInput("message_id");

    if (!number) {
      core.setFailed("This action only works for pull_request");
      return;
    }

    const octokit = getOctokit(githubToken);
    const previous = await findPreviousComment(octokit, repo, number, messageId);
    if (previous) {
      return;
    } else {
      await createComment(octokit, repo, number, messageId, messageFile);
    }
  } catch ({ message }) {
    core.setFailed(message);
  }
}

run();
