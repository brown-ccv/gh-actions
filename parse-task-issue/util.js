const jsyaml = require('js-yaml');
const fs = require('fs');


function getYMLFileContent(issue) {
  let start = issue.body.indexOf("taskName")
  let end = issue.body.lastIndexOf("```")
  var newtask = jsyaml.load(issue.body.substring(start, end));
  if(removeJunkAndValidateYML(newtask)===null) {return null};
  let yamlStr = jsyaml.safeDump(newtask)
  // remove non alpha numeric characters from the file name and join using - to get file name
  let file_name = (newtask.taskName.replace(/[^a-z0-9+\s]+/gi, '')).split(" ").join("-").toLowerCase() + ".yml";
  return [yamlStr, file_name];
}


function removeJunkAndValidateYML(contents){
  if(contents.links.deployment === "https://example.com"){ contents.links.deployment = null };
  if(contents.links.publication === "https://example.com"){ contents.links.publication = null };
  contents.framework.library = contents.framework.library.filter(function(v) {return v.startsWith("LIBRARY")===false});
  contents.framework.language = contents.framework.language.filter(function(v) {return v.startsWith("LANGUAGE")===false});
  contents.lab.developers = contents.lab.developers.filter(function(v) {return v.startsWith("DEVELOPER")===false});
  contents.tags = contents.tags.filter(function(v) {return v.startsWith("TAG")===false});
  if(contents.taskName === null || 
    contents.links.sourceCode === null ||
    contents.links.sourceCode === 'https://github.com/example/task' ||
    contents.lab.name === null ||
    contents.lab.institution === null  
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
