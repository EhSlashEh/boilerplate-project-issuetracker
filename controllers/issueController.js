const { Issue } = require('../models/issueModel');

// Get an issue by its ID
const getIssueById = async (issueId) => {
  try {
    const issue = await Issue.findById(issueId).exec();
    if (!issue) {
      throw new Error('Issue not found');
    }
    return issue;
  } catch (err) {
    throw new Error(`Failed to retrieve issue with _id: "${issueId}": ${err.message}`);
  }
};

// Create a new issue
const createIssue = async (projectId, issue_title, issue_text, created_by, assigned_to = '', status_text = '') => {
  try {
    const newIssue = new Issue({
      projectId,
      issue_title,
      issue_text,
      created_by,
      assigned_to,
      status_text,
      open: true
    });

    return await newIssue.save();
  } catch (err) {
    throw new Error(`Failed to create issue for project "${projectId}" with title "${issue_title}": ${err.message}`);
  }
};

// Update an existing issue
const updateIssue = async (_id, projectId, updates) => {
  try {
    updates.updated_on = new Date();

    const updatedIssue = await Issue.findOneAndUpdate(
      { _id, projectId },
      updates,
      { new: true }
    ).exec();

    if (!updatedIssue) {
      throw new Error(`No issue found to update with _id: "${_id}" and project: "${projectId}"`);
    }

    return updatedIssue;
  } catch (err) {
    throw new Error(`Failed to update issue with _id: "${_id}" for project "${projectId}": ${err.message}`);
  }
};

// Delete an issue
const deleteIssue = async (_id, projectId) => {
  try {
    const result = await Issue.deleteOne({ _id, projectId }).exec();
    
    if (result.deletedCount === 0) {
      throw new Error(`No issue found to delete with _id: "${_id}" and project: "${projectId}"`);
    }

    return { result: 'successfully deleted', _id };
  } catch (err) {
    throw new Error(`Failed to delete issue with _id: "${_id}" for project "${projectId}": ${err.message}`);
  }
};

module.exports = {
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue
};
