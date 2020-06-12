const fs = require("fs-extra")
const alex = require("alex")
const path = require("path")

const EXTENSIONS_TO_CHECK = {md: 'md', txt: 'text', text: 'text', html: 'html', yaml: 'text', yml: 'text'}

async function findPreviousComment(octokit, repo, issue_number, message_id) {
  const HEADER = `<!-- Alex Pull Request Comment - ${message_id} -->`; // Always a technical comment
  const { data: comments } = await octokit.issues.listComments({
    ...repo,
    issue_number
  });
  return comments.find(comment => comment.body.startsWith(HEADER));
}

async function createComment(octokit, repo, issue_number, message_id, comment) {
  const HEADER = `<!-- Alex Pull Request Comment - ${message_id} -->`;
  await octokit.issues.createComment({
    ...repo,
    issue_number,
    body: `${HEADER}\n${comment}`
  });
}

async function updateComment(octokit, repo, issue_number, comment_number, message_id, comment) {
  const HEADER = `<!-- Alex Pull Request Comment - ${message_id} -->`;
  await octokit.issues.updateComment({
    ...repo,
    issue_number,
		comment_number,
    body: `${HEADER}\n${comment}`
  });
}



async function checkFile(file, options) {
	const extension = path.extname(file)
	const checkType = EXTENSIONS_TO_CHECK[extension]

	const body = await fs.readFile(file, "utf-8");

	if (checkType === 'text') {
		return alex.text(body, options)
	} else if (checkType === 'md') {
		return alex.markdown(body, options)
	} else if (checkType === 'html') {
		return alex.html(body, options)
	}
}

function formatRow(msg) {
	let status = `:warning:`
	if (msg.fatal) {
		status = `:stop_sign:`
	}

	return `| ${status} | ${line}:${column} | ${actual} | ${reason} |`
}

function formatFileTable(res) {
	// don't post anything for files that are good
	if (res.result.messages.length == 0) {
		return ''
	}

	let header = `### ${res.filePath}\n`
	let tableHeader = `| Level | Location | Word | Recommendation |\n| :---: | :---: | :---: | :--- |\n`

	let rows = res.result.messages.map(msg => formatRow(msg))

	return `${header}${tableHeader}${rows.join('\n')}\n`
}

function formatComment(checkRes) {
	let header = `# Alex Recommends Report\n Alex recommends the following language changes, but Alex is a regular expression based algorithm, so take them with a grain of salt.\n`
	let sections = checkRes.map(res => formatFileTable(res))

	return `${header}${sections.join('\n')}`
}

async function checkAlex(fileList, noBinary, profanitySureness) {
	const filteredFilesList = filesList.filter((value) => fs.existsSync(value));
	const options = {noBinary: noBinary, profanitySureness: profanitySureness}

	let checkRes = Promise.all(filteredFilesList.map(file => {
		return {filePath: file, result: checkFile(file, options)}
	}))

	return formatComment(checkRes)
}

module.exports = {
	findPreviousComment,
	createComment,
	updateComment,
	EXTENSIONS_TO_CHECK,
	checkAlex
}
