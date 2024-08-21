const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

/*
let issue1;
let issue2;
suite("Functional Tests", function () {
  suite("Routing Tests", function () {
    suite("3 Post request Tests", function () {
      test("Create an issue with every field: POST request to /api/issues/{project}")
      chai
        .request(server)
        .post("/api/issues/testing123")
        .set("content-type", "application/json")
        .send({
          issue_title: "Issue 1",
          issue_text: "Functional Test",
          created_by: "fCC",
          assigned_to: "Dom",
          status_text: "Not Done",
        })
        .end(function (err, res) {
          assert.equal(res.status,200);
          issue1 = res.body;
          assert.equal(res.body.issue_title, "Issue 1");
          assert.equal(res.body.assigned_to, "Dom");
          assert.equal(res.body.created_by, "fCC");
          assert.equal(res.body.status_text, "Not Done");
          assert.equal(res.body.issue_text, "Functional Test");
          done();
        });
    }).timeout(10000);

  })
})
*/

/*
suite('Functional Tests', function() {

  suite('POST /api/issues/{project} => object with issue data', function() {

    test('Create an issue with every field', function(done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'Text',
          created_by: 'Functional Test - Every field',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'Text');
          assert.equal(res.body.created_by, 'Functional Test - Every field');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          done();
        });
    });

    test('Create an issue with only required fields', function(done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'Text',
          created_by: 'Functional Test - Required fields'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'Text');
          assert.equal(res.body.created_by, 'Functional Test - Required fields');
          assert.isUndefined(res.body.assigned_to);
          assert.isUndefined(res.body.status_text);
          done();
        });
    });

    test('Create an issue with missing required fields', function(done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title'
        })
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.text, 'Required fields missing');
          done();
        });
    });

  });

  suite('GET /api/issues/{project} => Array of objects with issue data', function() {

    test('View an issue by ID', function(done) {
      const validIssueId = '66c64fe3ad6cb41018c9b089';

      chai.request(server)
      .get(`/api/issues/${validIssueId}`)
      .end(function(err, res){
        if (err) {
          console.error('Error:', err);
        }
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'issue_title');
        assert.property(res.body, 'issue_text');
        assert.property(res.body, 'created_by');
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'updated_on');
        assert.property(res.body, 'open');
        assert.property(res.body, '_id');
        done();
      });
    });

    test('View issues on a project with one filter', function(done) {
      chai.request(server)
        .get('/api/issues/test')
        .query({ created_by: 'Functional Test - Required fields' })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          res.body.forEach(issue => {
            assert.equal(issue.created_by, 'Functional Test - Required fields');
          });
          done();
        });
    });

    test('View issues on a project with multiple filters', function(done) {
      chai.request(server)
        .get('/api/issues/test')
        .query({ created_by: 'Functional Test - Required fields', issue_title: 'Title' })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          res.body.forEach(issue => {
            assert.equal(issue.created_by, 'Functional Test - Required fields');
            assert.equal(issue.issue_title, 'Title');
          });
          done();
        });
    });

  });

  suite('PUT /api/issues/{project} => text', function() {

    test('Update one field on an issue', function(done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: 'VALID_ID_HERE',
          issue_title: 'Updated Title'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'successfully updated');
          done();
        });
    });

    test('Update multiple fields on an issue', function(done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: 'VALID_ID_HERE',
          issue_title: 'Updated Title',
          issue_text: 'Updated Text'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'successfully updated');
          done();
        });
    });

    test('Update an issue with missing _id', function(done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          issue_title: 'Updated Title'
        })
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.text, 'Missing _id');
          done();
        });
    });

    test('Update an issue with no fields to update', function(done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: 'VALID_ID_HERE'
        })
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.text, 'No update fields sent');
          done();
        });
    });

    test('Update an issue with an invalid _id', function(done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: 'INVALID_ID',
          issue_title: 'Updated Title'
        })
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.text, 'Could not update');
          done();
        });
    });

  });

  suite('DELETE /api/issues/{project} => text', function() {

    test('Delete an issue', function(done) {
      chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: 'VALID_ID_HERE'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'deleted '+ 'VALID_ID_HERE');
          done();
        });
    });

    test('Delete an issue with an invalid _id', function(done) {
      chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: 'INVALID_ID'
        })
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.text, 'Could not delete');
          done();
        });
    });

    test('Delete an issue with missing _id', function(done) {
      chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.text, 'Missing _id');
          done();
        });
    });

  });

});
*/
