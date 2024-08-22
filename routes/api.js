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
  
    .get(async function (req, res){
      var project = req.params.project;
      let filterObject = { ...req.query, project };

      try {
        const arrayOfResults = await Issue.find(filterObject);
        if (arrayOfResults) {
          return res.json(arrayOfResults);
        } else {
          return res.json([]);
        }
      } catch (error) {
        return res.status(500).json('There was an error retrieving the issues');
      }
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
    
    
    .put(async function (req, res){
      var project = req.params.project;
      let updateObject = {};

      Object.keys(req.body).forEach((key) => {
        if (req.body[key] != '' && key !== '_id') {
          updateObject[key] = req.body[key]
        }
      });

      if(Object.keys(updateObject).length === 0){
        return res.json('no updated field sent')
      }

      updateObject['updated_on'] = new Date().toUTCString();

      try {
        const updatedIssue = await Issue.findByIdAndUpdate(
          req.body._id,
          updateObject,
          { new: true }
        );

        if (updatedIssue) {
          return res.json('successfully updated');
        } else {
          return res.json('could not update ' + req.body._id);
        }
      } catch (error) {
        return res.status(500).json('There was an error updating the issue');
      }
    })
    
    .delete(async function (req, res) {
      var project = req.params.project;
      if (!req.body._id) {
        return res.json('id error');
      }
      
      try {
        const deletedIssue = await Issue.findByIdAndRemove(req.body._id);
        if (deletedIssue) {
          return res.json('deleted ' + req.body._id);
        } else {
          return res.json('could not delete ' + req.body._id);
        }
      } catch (error) {
        return res.status(500).json('There was an error deleting the issue');
      }
    });
        
};
