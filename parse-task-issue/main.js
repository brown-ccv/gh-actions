const core = require('@actions/core');
const { context, GitHub } = require('@actions/github');
const { getIssueBody, getYMLFileContent } = require("./util");

async function run() {
  try {
    const repo = context.repo;
    const number = context.issue.number;
    const githubToken = core.getInput("GITHUB_TOKEN", {required: true});

    if (!number) {
      core.setFailed("This action only works for issue");
      return;
    }

    const octokit = new GitHub(githubToken);

    const issue = await getIssueBody(octokit, repo, number)
    if(issue.labels.filter(function(item){ return item['name']==='data request'; })!==[]){
      var fileContents = getYMLFileContent(issue)
    }
    core.setOutput('file_content', fileContents)

  } catch ({ message }) {
    core.setFailed(message);
  }
}

run();
