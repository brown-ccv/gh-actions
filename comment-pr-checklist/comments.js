function getCommentTypes(body) {
  let comments = ["Technical"]

  bug = new RegExp('^.*\[x\].*Bug.*$')
  feat = new RegExp('^.*\[x\].*Feature.*$')
  data = new RegExp('^.*\[x\].*Data.*$')
  content = new RegExp('^.*\[x\].*Content.*$')
  other = new RegExp('^.*\[x\].*Other.*$')

  if (other.test(body) || feat.test(body)) {
    comments.push("Content 1")
    comments.push("Content 2")
  } else if (content.test(body)) {
    comments.push("Content")
  } else if (bug.test(body) || data.test(body)) {
    continue // no more reviews
  } else {
    comments.push("Content 1")
    comments.push("Content 2")
  }

  return comments
}

async function findFirstComment(octokit, repo, issue_number) {
  const { data: comments } = await octokit.issues.listComments({
    ...repo,
    issue_number
  });
  return comments[0].body;
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
