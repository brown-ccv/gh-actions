const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

async function run() {
  try {
    const repo = github.context.repo;
    const githubToken = core.getInput("GITHUB_TOKEN", {required: true});
    const website = core.getInput("website", {required: true});
    const notifySlack = core.getInput("notify_slack") === 'true';
    const slackWebhook = notifySlack
      ? core.getInput("slack_webhook_url", { required: true })
      : null;

    const octokit = github.getOctokit(githubToken);

    try {
      const res = await axios.get(website);
      if (res.status >= 400) {
        console.log("Bad status returned from website");
        if (notifySlack) {
          await notifySlackChannel(website, res.statusText, slackWebhook)
        }
        await openOrUpdateIssue(website, res.statusText, octokit, repo);
      } else {
        console.log("Succesfully contacted website");
        await closeIssueIfOpen(website, octokit, repo);
      }
    } catch (err) {
      console.log("Error with get request");
      await openOrUpdateIssue(website, err.message, octokit, repo);
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

async function notifySlackChannel(website, err, webhook) {
  let text = `${website} is down. Status: ${err}`
  try {
    await axios.post(webhook, { text });
    console.log("Sent Slack alert.");
  } catch (err) {
    console.error("Failed to send Slack alert:", err.message);
  }
}

async function openOrUpdateIssue(website, err, octokit, repo) {
  const { data: issues } = await octokit.issues.listForRepo({
    ...repo,
    state: 'open'
  });

  const title = `${website} Down`;

  const open_issue = issues.find(issue => issue.title.startsWith(title));

  if (open_issue) {
    const issue_number = open_issue.number;
    await octokit.issues.createComment({
      ...repo,
      issue_number,
      body: `still down:\n\n${err}`
    })
    console.log(`Updated issue ${issue_number}`)
  } else {
    await octokit.issues.create({
      ...repo,
      title,
      body: err,
      assignee: "tdivoll"
    })
    console.log(`Opened issue`)
  }
}

async function closeIssueIfOpen(website, octokit, repo) {
  const { data: issues } = await octokit.issues.listForRepo({
    ...repo,
    state: 'open'
  });

  const title = `${website} Down`;

  const open_issue = issues.find(issue => issue.title.startsWith(title));

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
