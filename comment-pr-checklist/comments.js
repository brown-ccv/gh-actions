function getCommentTypes(body) {
  let comments = ["Technical"]

  let bug = new RegExp('\[[xX]\] :bug: Bug')
  let feat = new RegExp('\[[xX]\] :dragon: Feature')
  let data = new RegExp('\[[xX]\] :frog: Data ')
  let content = new RegExp('\[[xX]\] :dog: Content')
  let other = new RegExp('\[[xX]\] :blowfish: Other')

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

Make sure the updates follow the contribution guidelines and the code is clear.  Some of the things you should check:

- [ ] All commits use conventional style
- [ ] Website builds
- [ ] Code is readable and easily understandable, with comments, but not commented out code
- [ ] Spacing and indentation is constistent
- [ ] README was updated (if needed) and update is comprehensive and useful
- [ ] No extraneous files added, especially a .env or similar
`
const contentChecklist = `
## Content Reviewer Checklist

Make sure the updates are consistent with the CCV website as a whole, the content is in the right place, and is easily understandable/accessible.  Some of the things you should check:

- [ ] Check spelling
- [ ] Will this make sense to an outsider?
- [ ] Is this information redundant with other places in the website?
- [ ] Does this look how you would expect?
`

module.exports = {
	getCommentTypes,
	findFirstComment,
	findPreviousComment,
	createComment
}
