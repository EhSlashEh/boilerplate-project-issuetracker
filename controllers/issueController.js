// controllers/issueController.js

const { Issue } = require('../models/issueModel');

// Get issues by project
const getIssuesByProject = async (project) => {
  try {
    return await Issue.find({ project }).exec();
  } catch (err) {
    throw new Error(`Failed to retrieve issues for project "${project}": ${err.message}`);
  }
};

// Create a new issue
const createIssue = async (project, issue_title, issue_text, created_by, assigned_to = '', status_text = '') => {
  try {
    const newIssue = new Issue({
      projectId: project,
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
    throw new Error(`Failed to create issue for project "${project}" with title "${issue_title}": ${err.message}`);
  }
};

// Update an existing issue
const updateIssue = async (_id, project, updates) => {
  try {
    updates.updated_on = new Date();

    const updatedIssue = await Issue.findOneAndUpdate(
      { _id, projectId: project },
      updates,
      { new: true }
    ).exec();

    if (!updatedIssue) {
      throw new Error(`No issue found to update with _id: "${_id}" and project: "${project}"`);
    }

    return updatedIssue;
  } catch (err) {
    throw new Error(`Failed to update issue with _id: "${_id}" for project "${project}": ${err.message}`);
  }
};

// Delete an issue
const deleteIssue = async (_id, project) => {
  try {
    const deletedIssue = await Issue.findOneAndDelete({ _id, projectId: project }).exec();
    
    if (!deletedIssue) {
      throw new Error(`No issue found to delete with _id: "${_id}" and project: "${project}"`);
    }

    return deletedIssue;
  } catch (err) {
    throw new Error(`Failed to delete issue with _id: "${_id}" for project "${project}": ${err.message}`);
  }
};

module.exports = {
  getIssuesByProject,
  createIssue,
  updateIssue,
  deleteIssue
};
