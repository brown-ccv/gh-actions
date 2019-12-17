async function getPrIds(octokit, repo, waitLabel) {
  const { data: prs } = await octokit.issues.listForRepo({
    ...repo,
    state: 'open'
  });
	const labelPrs = prs.filter(pr => pr.labels.map(label => label.name).includes(waitLabel))
  return labelPrs.map(pr => pr.number);
}

async function getPrTime(octokit, repo, issue_number) {
  const { data: issue } = await octokit.issues.get({
    ...repo,
    issue_number
  });
  return Date.parse(issue.created_at);
}

async function removeLabel(octokit, repo, issue_number, oldLabel) {
	const { data: labels } = await octokit.issues.listLabelsOnIssue({
		...repo,
		issue_number
	})

	console.log(labels)

	if (labels.find(label => label.name === oldLabel)) {
		await octokit.issues.removeLabel({
			...repo,
			issue_number,
			oldLabel
		})
	}
}

async function applyLabel(octokit, repo, issue_number, newLabel) {
	await octokit.issues.addLabels({
		...repo,
		issue_number,
		labels: [newLabel]
	})
}


module.exports = {
	getPrTime,
	applyLabel,
	removeLabel,
	getPrIds
}
