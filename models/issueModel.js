// models/issueModel.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const issueSchema = new Schema({
  projectId: { type: String, required: true },
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  assigned_to: { type: String, default: '' },
  status_text: { type: String, default: '' },
  open: { type: Boolean, default: true },
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now }
});

const Issue = mongoose.model('Issue', issueSchema);

const ProjectSchema = new Schema({
  name: { type: String, required: true },
});

const Project = mongoose.model("Project", ProjectSchema);

exports.Issue = Issue;
exports.Project = Project;
