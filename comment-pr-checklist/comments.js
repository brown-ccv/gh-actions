function getCommentTypes(body) {
  let comments = ["Technical"]

  let bug = new RegExp('^.*\[[xX]\].*Bug.*$')
  let feat = new RegExp('^.*\[[xX]\].*Feature.*$')
  let data = new RegExp('^.*\[[xX]\].*Data.*$')
  let content = new RegExp('^.*\[[xX]\].*Content.*$')
  let other = new RegExp('^.*\[[xX]\].*Other.*$')

  if (other.test(body) || feat.test(body)) {
    comments.push("Content 1")
    comments.push("Content 2")
  } else if (content.test(body)) {
    comments.push("Content")
  } else if (!bug.test(body) && !data.test(body)) { // fall through to two content reviewers
    comments.push("Content 1")
    comments.push("Content 2")
  }

  return comments
}

async function findFirstComment(octokit, repo, issue_number) {
  const { data: comments } = await octokit.issues.get({
    ...repo,
    issue_number
  });
  return comments.body;
}

async function findPreviousComment(octokit, repo, issue_number) {
  const HEADER = `<!-- Code Review Pull Request Comment - Technical -->`; // Always a technical comment
  const { data: comments } = await octokit.issues.listComments({
    ...repo,
    issue_number
  });
  return comments.find(comment => comment.body.startsWith(HEADER));
}

async function createComment(octokit, repo, issue_number, comment_type) {
  const HEADER = `<!-- Code Review Pull Request Comment - ${comment_type} -->`;
  let body
  if (comment_type === "Technical") {
    body = techChecklist
  } else {
    body = contentChecklist
  }
  await octokit.issues.createComment({
    ...repo,
    issue_number,
    body: `${HEADER}\n${body}`
  });
}

const techChecklist = `
## Technical Reviewer Checklist
- [ ] All commits use conventional style
- [ ] Website builds
- [ ] More things
`
const contentChecklist = `
## Content Reviewer Checklist
- [ ] Check spelling
- [ ] Will this make sense to an outsider?
- [ ] Is this information redundant with other places in the website?
`

module.exports = {
	getCommentTypes,
	findFirstComment,
	findPreviousComment,
	createComment
}
