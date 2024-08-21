'use strict';
const {
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue
} = require('../controllers/issueController');
const IssueModel = require("../models/issueModel").Issue;

module.exports = function (app) {

  app.route('/api/issues/:project')

    // Get an issue by its ID
    .get(async function (req, res) {
      let issueId = req.params.project; // Assuming `project` parameter is actually the issue ID
      try {
        const issue = await getIssueById(issueId);
        if (issue) {
          res.json(issue);
        } else {
          res.status(404).send("Issue not found");
        }
      } catch (err) {
        res.status(500).send(err.message);
      }
    })

    // Create a new issue
    .post(async function (req, res) {
      const { project } = req.params; // If `project` is needed for creating issues
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.status(400).send("Required fields missing");
      }

      try {
        const newIssue = await createIssue(project, issue_title, issue_text, created_by, assigned_to, status_text);
        res.json(newIssue);
      } catch (err) {
        console.error('Error creating issue:', err);
        res.status(500).send(err.message);
      }
    })

    // Update an existing issue
    .put(async function (req, res) {
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;

      if (!_id) {
        return res.status(400).send("Missing _id");
      }

      try {
        const updatedIssue = await updateIssue(_id, { issue_title, issue_text, created_by, assigned_to, status_text, open });
        if (updatedIssue) {
          res.send("successfully updated");
        } else {
          res.status(400).send("Could not update");
        }
      } catch (err) {
        res.status(500).send(err.message);
      }
    })

    // Delete an issue
    .delete(async function (req, res) {
      const { _id } = req.body;

      if (!_id) {
        return res.status(400).send("Missing _id");
      }

      try {
        const deletedIssue = await deleteIssue(_id);
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
