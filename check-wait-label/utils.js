async function getPrIds(octokit, repo, waitLabel) {
  const { data: prs } = await octokit.rest.issues.listForRepo({
    ...repo,
    state: 'open'
  });
	const labelPrs = prs.filter(pr => pr.labels.map(label => label.name).includes(waitLabel))
  return labelPrs.map(pr => pr.number);
}

async function getPrTime(octokit, repo, pull_number) {
  const { data: commits } = await octokit.rest.pulls.listCommits({
    ...repo,
    pull_number
  });

	let dates = commits.map(commit => new Date(commit.commit.author.date));
	let lastUpdated = Math.max(...dates)

	let lastUpdatedDate = new Date(lastUpdated)

  return lastUpdatedDate
}

async function removeLabel(octokit, repo, issue_number, oldLabel) {
	const { data: labels } = await octokit.rest.issues.listLabelsOnIssue({
		...repo,
		issue_number
	})

	if (labels.find(label => label.name === oldLabel)) {
		await octokit.rest.issues.removeLabel({
			...repo,
			issue_number,
			name: oldLabel
		})
	}
}

async function applyLabel(octokit, repo, issue_number, newLabel) {
	await octokit.rest.issues.addLabels({
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
