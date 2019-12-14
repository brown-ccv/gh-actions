const fs = require("fs-extra")

function getChangeTypes(body) {
  let changes = "|"

  let bug = new RegExp('\[[xX]+\] :bug: Bug')
  let feat = new RegExp('\[[xX]+\] :dragon: Feature')
  let data = new RegExp('\[[xX]+\] :frog: Data ')
  let content = new RegExp('\[[xX]+\] :dog: Content')
  let other = new RegExp('\[[xX]+\] :blowfish: Other')

	if (bug.test(body)) changes += "bug|"
	if (feat.test(body)) changes += "feature|"
	if (data.test(body)) changes += "data|"
	if (content.test(body)) changes += "content|"
	if (other.test(body)) changes += "other|"

  return changes
}

async function getPrBody(octokit, repo, issue_number) {
  const { data: comments } = await octokit.issues.get({
    ...repo,
    issue_number
  });
  return comments.body;
}


module.exports = {
	getChangeTypes,
	getPrBody
}
