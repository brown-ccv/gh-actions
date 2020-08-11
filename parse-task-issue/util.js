const jsyaml = require('js-yaml');
const fs = require('fs');
const _ = require('lodash');

function getYMLFileContent(issue) {
  let start = issue.body.indexOf("taskName")
  let end = issue.body.lastIndexOf("```")
  var newtask = jsyaml.load(issue.body.substring(start, end));
  if(removeJunkAndValidateYML(newtask)===null) {return null};
  let yamlStr = jsyaml.safeDump(newtask)
  // remove non alpha numeric characters from the file name and join using - to get file name
  let file_name = (newtask.taskName.replace(/[^a-z0-9+\s]+/gi, '')).split(" ").join("-").toLowerCase();
  return [yamlStr, file_name, newtask.taskName];
}


function removeJunkAndValidateYML(contents){
  if(contents.about.deployment === "https://example.com"){ contents.links.deployment = null };
  if(contents.about.publication === "https://example.com"){ contents.links.publication = null };
  if(contents.about.sourceCode.link === 'https://github.com/example/task' ){ contents.links.sourceCode.link = null };
  contents.framework = (contents.framework!=null)?contents.framework.filter(function(v) {return v.name.startsWith("FRAMEWORK")===false}):null;
  contents.language = (contents.language!=null)?contents.language.filter(function(v) {return v.startsWith("LANGUAGE")===false}):null;
  contents.lab.developers = (contents.lab.developers!=null)?contents.lab.developers.filter(function(v) {return v.startsWith("DEVELOPER")===false}):null;
  contents.tags = (contents.tags!=null)?contents.tags.filter(function(v) {return v.startsWith("TAG")===false}):null;
  if(contents.taskName === null || 
    contents.taskName === 'Example Task' ||
    contents.about.description === null ||
    contents.about.description === 'A short description of the task' ||
    contents.about.sourceCode.access === null ||
    contents.about.sourceCode.access === 'private/public' ||
    _.some(contents.framework, ['link',null]) ||
    _.some(contents.lab, ['name',null]) ||
    _.some(contents.lab, ['institution',null])  
    ){
      return null;
    }
    return contents;
}

async function getIssueBody(octokit, repo, issue_number) {
  const { data: issue } = await octokit.issues.get({
    ...repo,
    issue_number
  });
  return issue;
}


module.exports = {
	getYMLFileContent,
	getIssueBody
}
