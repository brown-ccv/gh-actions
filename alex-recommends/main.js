const core = require('@actions/core');
const github = require('@actions/github');
const glob = require('@actions/glob')
const path = require("path")
const { findPreviousComment, createComment, updateComment, EXTENSIONS_TO_CHECK, checkAlex, getExt } = require("./utils");

async function run() {
  try {
    const context = github.context
    const repo = context.repo;
    const number = context.payload.pull_request.number;
    const githubToken = core.getInput("GITHUB_TOKEN", {required: true});
    const messageId = core.getInput("message_id");
    const prOnly = core.getInput("pr_only")
    const globPattern = core.getInput("glob_pattern")

    console.warn(globPattern)

    if (!number) {
      core.setFailed("This action only works for pull_request");
      return;
    }

    const octokit = github.getOctokit(githubToken);

    const globber = await glob.create(globPattern)
    let files = await globber.glob()
    console.warn(files)

    if (prOnly) {
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
      let prFiles = prInfo.repository.pullRequest.files.nodes.map(f => f.path);
      console.warn(prFiles)
      files = files.filter(x => prFiles.includes(x))
    }

    console.warn(files)

    core.setFailed("Force fail");
    return;

    const filesToCheck = files
      .filter(f => {
        return EXTENSIONS_TO_CHECK.hasOwnProperty(getExt(f.path))
      })

    const noBinary = core.getInput('no_binary')
    const profanitySureness = core.getInput('profanity_sureness')
    const checkComment = checkAlex(filesToCheck, noBinary, profanitySureness)

    const previous = await findPreviousComment(octokit, repo, number, messageId);
    if (previous) {
      await updateComment(octokit, repo, previous.id, messageId, checkComment)
    } else {
      await createComment(octokit, repo, number, messageId, checkComment);
    }
  } catch ({ message }) {
    core.setFailed(message);
  }
}

run();
