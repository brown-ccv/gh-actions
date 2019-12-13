import * as core from "@actions/core";
import { context, GitHub } from "@actions/github";
import { findPreviousComment, createComment, findFirstComment, numContentReviewers } from "./comment";

async function run() {
  try {
    const repo = context.repo;
    const number = context?.payload?.pull_request?.number;
    const body = core.getInput("message");
    const githubToken = core.getInput("GITHUB_TOKEN");
    if (!number) {
      core.setFailed("This action only works for pull_request");
      return;
    }
    if (!body || !githubToken) {
      core.setFailed("invalid input: please check your workflow");
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
        await createComment(octokit, repo, number, comment);
      }

    }
  } catch ({ message }) {
    core.setFailed(message);
  }
}

run();
