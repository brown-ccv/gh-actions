// simple script to run in node console to confirm new pr time function is owrking

const { GitHub } = require('@actions/github');
const { getPrTime} = require("./utils");

const repo = {owner: 'brown-ccv', repo: 'ccv-website'};
const githubToken = process.env.GITHUB_TOKEN
const octokit = new GitHub(githubToken)
const pr = 176

let nowTime = new Date(Date.now())
let prTime
getPrTime(octokit, repo, pr).then(val => prTime = val)
