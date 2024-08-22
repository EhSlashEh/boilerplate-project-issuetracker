'use strict';

var expect = require('chai').expect;
let mongodb = require('mongodb')
let mongoose = require('mongoose')

const uri = process.env.MONGO_URI;

module.exports = function (app) {
  
  mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

  let issueSchema = new mongoose.Schema({
    issue_title: {type: String, required: true},
    issue_text: {type: String, required: true},
    created_by : {type: String, required: true},
    assigned_to : String,
    status_text : String,
    open: {type: Boolean, required: true},
    created_on: {type: Date, required: true},
    updated_on: {type: Date, required: true},
    project: String
  })
  
  let Issue = mongoose.model('Issue', issueSchema)

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      let filterObject = Object.assign(req.query)
      filterObject['project'] =project
      Issue.find(
        filterObject,
        (error, arrayOfResults) => {
          if(!error && arrayOfResults){
            return res.json(arrayOfResults)
          }
        }
      )
    })
    
    .post(async function (req, res) {
      var project = req.params.project;
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        return res.json('Required fields missing from request');
      }
    
      let newIssue = new Issue({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        status_text: req.body.status_text || '',
        open: true,
        created_on: new Date().toUTCString(),
        updated_on: new Date().toUTCString(),
        project: project
      });
    
      try {
        const savedIssue = await newIssue.save();
        return res.json(savedIssue);
      } catch (error) {
        return res.status(500).json('There was an error saving the issue');
      }
    })
    
    
    .put(function (req, res){
      var project = req.params.project;
      let updateObject = {}
      Object.keys(req.body).forEach((key) => {
        if(req.body[key] != ''){
          updateObject[key] = req.body[key]
        }
      })
      if(Object.keys(updateObject).length < 2){
        return res.json('no updated field sent')
      }
      updateObject['updated_on'] = new Date().toUTCString()
      Issue.findByIdAndUpdate(
      req.body._id,
      updateObject,
      {new: true},
      (error, updatedIssue) => {
       if(!error && updatedIssue){
          return res.json('successfully updated')
        }else if(!updatedIssue){
          return res.json('could not update '+ req.body._id)
        }
      }
        )
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      if(!req.body._id){
        return res.json('id error')
      }
      Issue.findByIdAndRemove(req.body._id, (error, deletedIssue) => {
        if(!error && deletedIssue){
          res.json( 'deleted '+ deletedIssue.id)
        }else if(!deletedIssue){
          res.json('could not delete '+ req.body._id)
        }
      })
    });
    
};
/*
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
*/