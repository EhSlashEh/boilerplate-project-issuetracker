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
    let projectName = req.params.project;
      try {
        const project = await ProjectModel.findOne({ name: projectName });
        if (!project) {
          res.json([{ error: "project not found" }]);
          return;
        } else {
          const issues = await IssueModel.find({
            projectId: project._id,
            ...req.query
          });
          if (!issues) {
            res.json([{ error: "no issues found"}]);
            return
          }
          res.json(issues);
        }
      } catch (err) {
        res.json({ error: "could not get", _id: _id });
      }
    })

    .post(async function (req, res) {
      let projectName = req.params.project;
      const { project } = req.params; // If `project` is needed for creating issues
      const { issue_title, issue_text, created_by, assigned_to = '', status_text = '' } = req.body;

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

    .put(async function (req, res) {
      let projectName = req.params.project;
      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open
      } = req.body;

      if (!_id) {
        res.json({ error: "missing _id" });
        return;
      }
      if (
        !issue_title &&
        !issue_text &&
        !created_by &&
        !assigned_to &&
        !status_text &&
        !open
      ) {
        res.json({ error: "no update field(s) sent", _id: _id});
        return;
      }

      try {
        const projectModel = await ProjectModel.findOne({ name: projectName });
        if (!projectModel) {
          throw new Error("project not found");
        }
        let issue = await IssueModel.findByIdAndUpdate(_id, {
          ...req.body,
          updated_on: new Date(),
        });
        await issue.save();
        res.json({ result: "successfully updated", _id: _id });
      } catch (err) {
        res.json({ error: "could not update", _id: _id });
      }
    })

    // Delete an issue
    .delete(async function (req, res) {
      let projectName = req.params.project;
      const { _id } = req.body;
      if (!_id) {
        res.json({ error: "missing _id" });
        return;
      }
      try {
        const projectModel = await ProjectModel.findOne({ name: projectName });
        if (!projectModel) {
          throw new Error("project not found");
        }
        const result = await IssueModel.deleteOne({
          _id: _id,
          projectId: projectModel._id,
        });
        if (result.deletedCount === 0) {
          throw new Error("ID not found");
        }
        res.json({ result: "successfully deleted", _id: _id });
      } catch (err) {
        res.json({ error: "cold not delete", _id: _id });
      }
    });
};
