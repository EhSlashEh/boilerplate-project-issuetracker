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
        return res.json({ error: 'required field(s) missing' });
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
    
    
    .put(async function (req, res) {
      var project = req.params.project;
      let _id = req.body._id;
    
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
    
      let updateObject = {};
    
      // Create an updateObject with all fields except `_id`
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] !== '' && key !== '_id') {
          updateObject[key] = req.body[key];
        }
      });
    
      // If no fields are provided for update, return an error
      if (Object.keys(updateObject).length === 0) {
        return res.json({ error: 'no update field(s) sent', '_id': _id });
      }
    
      // Set the `updated_on` field to the current date and time
      updateObject['updated_on'] = new Date().toUTCString();
    
      try {
        // Find the issue by ID and update it with the provided fields
        const updatedIssue = await Issue.findByIdAndUpdate(
          _id,
          updateObject,
          { new: true }  // Return the updated document
        );
    
        if (updatedIssue) {
          // Return success response with the updated issue ID
          return res.json({ result: 'successfully updated', '_id': _id });
        } else {
          // Return error response if no issue was found with the provided ID
          return res.json({ error: 'could not update', '_id': _id });
        }
      } catch (error) {
        // Return error response in case of any exception
        return res.json({ error: 'could not update', '_id': _id });
      }
    })
        
    .delete(async function (req, res) {
      var project = req.params.project;
      const { _id } = req.body;
    
      // Debugging: log the request body
      console.log('DELETE Request Body:', req.body);
    
      if (!_id) {
        // Debugging: log the missing ID case
        console.log('Error: missing _id');
        return res.json({ error: 'missing _id' });
      }
    
      try {
        const deletedIssue = await Issue.findByIdAndDelete(_id);
        
        // Debugging: log the result of deletion
        console.log('Deleted Issue:', deletedIssue);
    
        if (deletedIssue) {
          // Debugging: log success case
          console.log('Success: Issue deleted');
          return res.json({ result: 'successfully deleted', _id: _id });
        } else {
          // Debugging: log if no issue was found
          console.log('Error: could not delete - Issue not found');
          return res.json({ error: 'could not delete', _id: _id });
        }
      } catch (error) {
        // Debugging: log exception
        console.log('Exception:', error);
        return res.json({ error: 'could not delete', _id: _id });
      }
    });
                
};
