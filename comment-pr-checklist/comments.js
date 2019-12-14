const fs = require("fs-extra")


async function findPreviousComment(octokit, repo, issue_number, message_id) {
  const HEADER = `<!-- Code Review Pull Request Comment - ${message_id} -->`; // Always a technical comment
  const { data: comments } = await octokit.issues.listComments({
    ...repo,
    issue_number
  });
  return comments.find(comment => comment.body.startsWith(HEADER));
}

async function createComment(octokit, repo, issue_number, message_id, message_file) {
  const HEADER = `<!-- Code Review Pull Request Comment - ${message_id} -->`;
  let body = await fs.readFile(message_file, "utf-8");
  await octokit.issues.createComment({
    ...repo,
    issue_number,
    body: `${HEADER}\n${body}`
  });
}

module.exports = {
	findPreviousComment,
	createComment
}
