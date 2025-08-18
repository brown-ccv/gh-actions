const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

async function run() {
  try {
    const repo = github.context.repo;
    const githubToken = core.getInput("GITHUB_TOKEN", {required: true});
    const website = core.getInput("website", {required: true});
    const slackWebhook = core.getInput("slack_webhook_url", { required: false }) || null;
    const octokit = github.getOctokit(githubToken);


    console.log(`Checking if ${website} is up...`);
    console.log(`Using GitHub token: ${githubToken}`);
    console.log(`Using Slack webhook: ${slackWebhook}`);
    
    try {
      const res = await axios.get(website, { validateStatus: () => true });
      if (res.status >= 400) {
        console.log("Bad status returned from website");
        if (slackWebhook) {
          await notifySlackChannel(website, res.statusText, slackWebhook, repo)
        }
        await openOrUpdateIssue(website, res.statusText, octokit, repo);
      } else {
        console.log("Successfully contacted website");
        await closeIssueIfOpen(website, octokit, repo);
      }
    } catch (err) {
      console.log("Error with get request");
      if (slackWebhook) {
        console.log(`Notifying Slack channel with webhook ${slackWebhook}`);
        await notifySlackChannel(website, err.message, slackWebhook, repo)
      }
      await openOrUpdateIssue(website, err.message, octokit, repo);
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

async function notifySlackChannel(website, err, webhook, repo) {
  const open_issue = await checkForOpenIssue(website, repo)
  if (!open_issue) {
    let text = `${website} is down. Status: ${err}`
    try {
      await axios.post(webhook, { text });
      console.log("Sent Slack alert.");
    } catch (err) {
      console.error("Failed to send Slack alert:", err.message);
    }
  }
}

async function checkForOpenIssue(website, repo) {
  const githubToken = core.getInput("GITHUB_TOKEN", {required: true});
  const octokit = github.getOctokit(githubToken);

  const { data: issues } = await octokit.issues.listForRepo({
    ...repo,
    state: 'open'
  });

  const title = `${website} Down`;
  const open_issue = issues.find(issue => issue.title.startsWith(title));
  
  return open_issue
}

async function openOrUpdateIssue(website, err, octokit, repo) {
  const open_issue = await checkForOpenIssue(website, repo)

  if (open_issue) {
    const issue_number = open_issue.number;
    await octokit.issues.createComment({
      ...repo,
      issue_number,
      body: `still down:\n\n${err}`
    })
    console.log(`Updated issue ${issue_number}`)
  } else {
    const title = `${website} Down`;
    await octokit.issues.create({
      ...repo,
      title,
      body: err,
      assignees: ["tdivoll", "fordmcdonald"]
    })
    console.log(`Opened issue`)
  }
}

async function closeIssueIfOpen(website, octokit, repo) {
  const open_issue = await checkForOpenIssue(website, repo)

  if (open_issue) {
    const issue_number = open_issue.number;
    await octokit.issues.update({
      ...repo,
      issue_number,
      state: 'closed'
    })
    console.log(`Closed issue ${issue_number}`)
  }
}

run()
