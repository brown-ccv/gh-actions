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
	let create_time = new Date(issue.created_at)
  return create_time
}

async function removeLabel(octokit, repo, issue_number, oldLabel) {
	const { data: labels } = await octokit.issues.listLabelsOnIssue({
		...repo,
		issue_number
	})

	if (labels.find(label => label.name === oldLabel)) {
		await octokit.issues.removeLabel({
			...repo,
			issue_number,
			name: oldLabel
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

function getWeekendDaysCount(startDate, endDate) {
  let count = 0;
  let curDate = startDate;
  while (curDate <= endDate) {
    var dayOfWeek = curDate.getDay();
    if ((dayOfWeek == 6) || (dayOfWeek == 0)) {
		  count++
		}

		curDate.setDate(curDate.getDate() + 1);
  }
  return count;
}


module.exports = {
	getPrTime,
	applyLabel,
	removeLabel,
	getPrIds,
	getWeekendDaysCount
}
