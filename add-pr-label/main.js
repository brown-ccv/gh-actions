const core = require('@actions/core');
const { context, GitHub } = require('@actions/github');

async function applyLabel(octokit, repo, issue_number, newLabel) {
	await octokit.issues.addLabels({
		...repo,
		issue_number,
		labels: newLabel
	})
}

async function run() {
  try {
    const repo = context.repo;
    const number = context.payload.pull_request.number;
    const githubToken = core.getInput("GITHUB_TOKEN", {required: true});
    const label = core.getInput("label", {required: true});

    if (!number) {
      core.setFailed("This action only works for pull_request");
      return;
    }

    const octokit = new GitHub(githubToken);
    await applyLabel(octokit, repo, number, label);

  } catch ({ message }) {
    core.setFailed(message);
  }
}

run();
