'use strict';

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      // Fetch all issues for the specified project from the database
      // Assuming you have a function `getIssuesByProject` to get the issues
      getIssuesByProject(project)
        .then(issues => res.json(issues))
        .catch(err => res.status(500).send(err.message));
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      
      if (!issue_title || !issue_text || !created_by) {
        return res.status(400).send("Required fields missing");
      }
      
      // Assuming you have a function `createIssue` to create a new issue
      createIssue(project, issue_title, issue_text, created_by, assigned_to, status_text)
        .then(newIssue => res.json(newIssue))
        .catch(err => res.status(500).send(err.message));
    })
    
    .put(function (req, res){
      let project = req.params.project;
      let { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;

      if (!_id) {
        return res.status(400).send("Missing _id");
      }
      
      // Assuming you have a function `updateIssue` to update the issue
      updateIssue(_id, project, { issue_title, issue_text, created_by, assigned_to, status_text, open })
        .then(updatedIssue => res.json(updatedIssue))
        .catch(err => res.status(500).send(err.message));
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      let { _id } = req.body;

      if (!_id) {
        return res.status(400).send("Missing _id");
      }
      
      // Assuming you have a function `deleteIssue` to delete the issue
      deleteIssue(_id, project)
        .then(result => res.json(result))
        .catch(err => res.status(500).send(err.message));
    });
    
};
