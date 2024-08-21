'use strict';

const {
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue
} = require('../controllers/issueController');

const IssueModel = require("../models/issueModel").Issue;
const ProjectModel = require("../models/issueModel").Project;

module.exports = function (app) {

  app.route('/api/issues/:project')
    .get(async function (req, res) {
      const projectName = req.params.project;
      try {
        const project = await ProjectModel.findOne({ name: projectName });
        if (!project) {
          return res.json({ error: "Project not found" });
        }
        const issues = await IssueModel.find({ projectId: project._id, ...req.query }).exec();
        if (issues.length === 0) {
          return res.json({ error: "No issues found" });
        }
        res.json(issues);
      } catch (err) {
        res.status(500).json({ error: `Could not get issues: ${err.message}` });
      }
    })

    .post(async function (req, res) {
      const projectName = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to = '', status_text = '' } = req.body;

      console.log('Request Body:', req.body); // Log request body for debugging

      if (!issue_title || !issue_text || !created_by) {
        return res.status(400).send("Required fields missing");
      }

      try {
        const project = await ProjectModel.findOne({ name: projectName });
        if (!project) {
          return res.status(404).json({ error: "Project not found" });
        }
        const newIssue = await createIssue(project._id, issue_title, issue_text, created_by, assigned_to, status_text);
        res.json(newIssue);
      } catch (err) {
        console.error('Error creating issue:', err); // Log error for debugging
        res.status(500).send(`Error creating issue: ${err.message}`);
      }
    })

    .put(async function (req, res) {
      const projectName = req.params.project;
      const { _id, ...updates } = req.body;

      if (!_id) {
        return res.status(400).json({ error: "Missing _id" });
      }
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No update fields sent", _id });
      }

      try {
        const project = await ProjectModel.findOne({ name: projectName });
        if (!project) {
          return res.status(404).json({ error: "Project not found" });
        }
        const updatedIssue = await updateIssue(_id, project._id, updates);
        res.json({ result: "successfully updated", _id });
      } catch (err) {
        res.status(500).json({ error: `Could not update issue: ${err.message}`, _id });
      }
    })

    .delete(async function (req, res) {
      const projectName = req.params.project;
      const { _id } = req.body;

      if (!_id) {
        return res.status(400).json({ error: "Missing _id" });
      }

      try {
        const project = await ProjectModel.findOne({ name: projectName });
        if (!project) {
          return res.status(404).json({ error: "Project not found" });
        }
        const result = await deleteIssue(_id, project._id);
        res.json(result);
      } catch (err) {
        res.status(500).json({ error: `Could not delete issue: ${err.message}`, _id });
      }
    });
};
