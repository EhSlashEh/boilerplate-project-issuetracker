// controllers/issueController.js

const Issue = require('../models/issueModel');

// Get issues by project
const getIssuesByProject = async (project) => {
  try {
    return await Issue.find({ project }).exec();
  } catch (err) {
    throw new Error(`Failed to retrieve issues: ${err.message}`);
  }
};

// Create a new issue
const createIssue = async (project, issue_title, issue_text, created_by, assigned_to = '', status_text = '') => {
  try {
    const newIssue = new Issue({
      project,
      issue_title,
      issue_text,
      created_by,
      assigned_to,
      status_text,
      open: true,
      created_on: new Date(),
      updated_on: new Date()
    });

    return await newIssue.save();
  } catch (err) {
    throw new Error('Failed to create issue');
  }
};

// Update an existing issue
const updateIssue = async (_id, project, updates) => {
  try {
    updates.updated_on = new Date();

    const updatedIssue = await Issue.findOneAndUpdate(
      { _id, project },
      updates,
      { new: true }
    ).exec();

    return updatedIssue;
  } catch (err) {
    throw new Error('Failed to update issue');
  }
};

// Delete an issue
const deleteIssue = async (_id, project) => {
  try {
    const deletedIssue = await Issue.findOneAndDelete({ _id, project }).exec();
    return deletedIssue;
  } catch (err) {
    throw new Error('Failed to delete issue');
  }
};

module.exports = {
  getIssuesByProject,
  createIssue,
  updateIssue,
  deleteIssue
};
