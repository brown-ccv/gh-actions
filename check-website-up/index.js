const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

async function run() {
  try {
    const repo = github.context.repo;
    const githubToken = core.getInput("github_token", {required: true});
    const website = core.getInput("website", {required: true});
    const slackWebhook = core.getInput("slack_webhook_url", { required: false }) || null;
    const octokit = github.getOctokit(githubToken);
    const assignees = core.getInput("assignees", { required: false }).split(",").map(a => a.trim()).filter(Boolean);

    console.log(`Checking if ${website} is up...`);

    try {
      const res = await axios.get(website, { validateStatus: () => true, timeout: 8000 });
      if (res.status >= 400) {
        console.log("Bad status returned from website");
        const open_issue = await checkForOpenIssue(website, repo)
        if (slackWebhook && !open_issue) {
          await notifySlackChannel(website, `is down with status: ${res.status} ${res.statusText}`, slackWebhook)
        }
        await openOrUpdateIssue(website, res.statusText, octokit, repo, assignees, open_issue);
      } else {
        console.log("Successfully contacted website");
        await closeIssueIfOpen(website, octokit, repo, slackWebhook);
      }
    } catch (err) {
      console.log("Error with get request");
      const open_issue = await checkForOpenIssue(website, repo)
      if (slackWebhook && !open_issue) {
        await notifySlackChannel(website, `is unreachable: ${err.message}`, slackWebhook)
      }
      await openOrUpdateIssue(website, err.message, octokit, repo, assignees, open_issue);
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

async function notifySlackChannel(website, msg, webhook) {
  let text = `${website} ${msg}`;
  try {
    await axios.post(webhook, { text });
    console.log("Sent Slack alert.");
  } catch (err) {
    console.error("Failed to send Slack alert:", err.message);
  }
}

async function checkForOpenIssue(website, repo) {
  const githubToken = core.getInput("github_token", {required: true});
  const octokit = github.getOctokit(githubToken);

  const { data: issues } = await octokit.issues.listForRepo({
    ...repo,
    state: 'open'
  });

  const title = `${website} Down`;
  const open_issue = issues.find(issue => issue.title.startsWith(title));
  
  return open_issue
}

async function openOrUpdateIssue(website, err, octokit, repo, assignees, open_issue) {
  if (open_issue) {
    const issue_number = open_issue.number;
    await octokit.issues.createComment({
      ...repo,
      issue_number,
      body: `Still down...\n\n${err}`
    })
    console.log(`Updated issue ${issue_number}`)
  } else {
    const title = `${website} Down`;
    await octokit.issues.create({
      ...repo,
      title,
      body: err,
      labels: ['bug'],
      assignees: assignees.length > 0 ? assignees : undefined
    })
    console.log(`Opened issue`)
  }
}

async function closeIssueIfOpen(website, octokit, repo, slackWebhook) {
  const open_issue = await checkForOpenIssue(website, repo)

  if (open_issue) {
    const issue_number = open_issue.number;
    await octokit.issues.update({
      ...repo,
      issue_number,
      state: 'closed'
    })
    console.log(`Closed issue ${issue_number}`)
    if (slackWebhook) {
      await notifySlackChannel(website, 'is back up', slackWebhook)
    }
  }
}

run()
