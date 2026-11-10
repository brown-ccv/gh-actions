const core = require('@actions/core');
const { getIssueBody, getYMLFileContent } = require("./util");

async function run() {
  try {
    const { context, getOctokit } = await import('@actions/github');
    const repo = context.repo;
    const number = context.issue.number;
    const githubToken = core.getInput("GITHUB_TOKEN", {required: true});

    if (!number) {
      core.setFailed("This action only works for issue");
      return;
    }

    const octokit = getOctokit(githubToken);

    const issue = await getIssueBody(octokit, repo, number);

    if (issue.labels.some(item => item.name === 'data request')) {
      const file = getYMLFileContent(issue);
      if(file[0]===null || file[1]===null || file[1]===""){
        core.setFailed("The issue yml template is not valid.");
        return;
      }
      core.setOutput('issue_number', String(number))
      core.setOutput('task_name', file[2])
      core.setOutput('file_name', file[1])
      core.setOutput('file_content', file[0])
    }

  } catch ({ message }) {
    core.setFailed(message);
  }
}

run();
