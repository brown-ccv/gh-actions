const core = require('@actions/core');
const { context, GitHub } = require('@actions/github');
const { findPreviousComment, createComment, findFirstComment, getCommentTypes } = require("./comments");

async function run() {
  try {
    const repo = context.repo;
    const number = context.payload.pull_request.number;
    const githubToken = core.getInput("GITHUB_TOKEN");
    if (!number) {
      core.setFailed("This action only works for pull_request");
      return;
    }
    if (!githubToken) {
      core.setFailed("must supply github token");
      return;
    }
    const octokit = new GitHub(githubToken);
    const previous = await findPreviousComment(octokit, repo, number);
    if (previous) {
      return;
    } else {
      const first = await findFirstComment(octokit, repo, number)
      const commentTypes = getCommentTypes(first)
      for (comment in commentTypes) {
        console.log(comment)
        await createComment(octokit, repo, number, comment);
      }

    }
  } catch ({ message }) {
    core.setFailed(message);
  }
}

run();
