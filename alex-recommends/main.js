const core = require('@actions/core');
const github = require('@actions/github');
const path = require("path")
const { findPreviousComment, createComment, EXTENSIONS_TO_CHECK, checkAlex } = require("./utils");

async function run() {
  try {
    const context = github.context
    const repo = context.repo;
    const number = context.payload.pull_request.number;
    const githubToken = core.getInput("GITHUB_TOKEN", {required: true});
    const messageId = core.getInput("message_id");

    if (!number) {
      core.setFailed("This action only works for pull_request");
      return;
    }

    const octokit = github.getOctokit(githubToken);

    const prInfo = await octokit.graphql(
      `
        query prInfo($owner: String!, $name: String!, $prNumber: Int!) {
          repository(owner: $owner, name: $name) {
            pullRequest(number: $prNumber) {
              files(first: 100) {
                nodes {
                  path
                }
              }
            }
          }
        }
      `,
      {
        owner: context.repo.owner,
        name: context.repo.repo,
        prNumber: context.issue.number
      }
    );

    console.warn(prInfo)

    const files = prInfo.repository.pullRequest.files.nodes;

    console.warn(files)
    const filesToCheck = files
      .filter(f => EXTENSIONS_TO_CHECK.hasOwnProperty(path.extname(f.path)))
      .map(f => f.path);
    if (filesToCheck.length < 1) {
      console.warn(
        `No files with [${Objeck.keys(EXTENSIONS_TO_CHECK).join(
          ', '
        )}] extensions added or modified in this PR, nothing to lint...`
      );
      return;
    } else {
      console.warn(`found ${filesToCheck.length} files to check`)
    }

    const noBinary = core.getInput('no_binary')
    const profanitySureness = core.getInput('profanity_sureness')
    const checkComment = await checkAlex(filesToCheck, noBinary, profanitySureness)

    const previous = await findPreviousComment(octokit, repo, number, messageId);
    if (previous) {
      await updateComment(octokit, repo, number, previous[0].number, messageId, checkComment)
    } else {
      await createComment(octokit, repo, number, messageId, checkComment);
    }
  } catch ({ message }) {
    core.setFailed(message);
  }
}

run();
