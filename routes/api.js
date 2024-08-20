'use strict';
const {
  getIssuesByProject,
  createIssue,
  updateIssue,
  deleteIssue
} = require('../controllers/issueController');

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(async function (req, res) {
      let project = req.params.project;
      try {
        const issues = await getIssuesByProject(project);
        res.json(issues);
      } catch (err) {
        res.status(500).send(err.message);
      }
    })

    .post(async function (req, res) {
      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.status(400).send("Required fields missing");
      }

      try {
        const newIssue = await createIssue(project, issue_title, issue_text, created_by, assigned_to, status_text);
        res.json(newIssue);
      } catch (err) {
        res.status(500).send(err.message);
      }
    })

    .put(async function (req, res) {
      let project = req.params.project;
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;

      if (!_id) {
        return res.status(400).send("Missing _id");
      }

      try {
        const updatedIssue = await updateIssue(_id, project, { issue_title, issue_text, created_by, assigned_to, status_text, open });
        if (updatedIssue) {
          res.send("successfully updated");
        } else {
          res.status(400).send("Could not update");
        }
      } catch (err) {
        res.status(500).send(err.message);
      }
    })

    .delete(async function (req, res) {
      let project = req.params.project;
      const { _id } = req.body;

      if (!_id) {
        return res.status(400).send("Missing _id");
      }

      try {
        const deletedIssue = await deleteIssue(_id, project);
        if (deletedIssue) {
          res.send(`deleted ${_id}`);
        } else {
          res.status(400).send("Could not delete");
        }
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

};
