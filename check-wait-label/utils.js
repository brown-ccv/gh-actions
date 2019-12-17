async function getPrIds(octokit, repo, label) {
  const { data: prs } = await octokit.issues.listForRepo({
    ...repo,
    state: 'open',
		labels: label
  });
  return prs.map(pr => prs.id);
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

	if (labels.find(label => comment.name.equals(oldLabel))) {
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
		labels: newLabel
	})
}


module.exports = {
	getPrTime,
	applyLabel,
	removeLabel
}
