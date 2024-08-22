const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let id1 = "";
let id2 = "";

suite("Functional Tests", function() {
  suite("POST /api/issues/{project} => object with issue data", function() {
    test("Every field filled in", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In QA"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "text");
          assert.equal(
            res.body.created_by,
            "Functional Test - Every field filled in"
          );
          assert.equal(res.body.assigned_to, "Chai and Mocha");
          assert.equal(res.body.status_text, "In QA");
          assert.equal(res.body.project, "test");
          id1 = res.body._id;
          console.log("id 1 has been set as " + id1);
          done();
        });
    });

    test("Required fields filled in", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title 2",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title 2");
          assert.equal(res.body.issue_text, "text");
          assert.equal(
            res.body.created_by,
            "Functional Test - Every field filled in"
          );
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          assert.equal(res.body.project, "test");
          id2 = res.body._id;
          console.log("id 2 has been set as " + id2);
          done();
        })
    });
    
    test("Missing required fields", function(done) {
        chai
          .request(server)
          .post("/api/issues/test")
          .send({
            issue_title: "Title"
          })
          .end(function(err, res) {
            assert.equal(res.body, 'Required fields missing from request');
            done();
          });
      });
  })

  suite("PUT /api/issues/{project} => text", function() {
    test("No body", function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({})
        .end(function(err, res) {
          assert.equal(res.body, "no updated field sent");
          done();
        });
    });

    test("One field to update", function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: id1,
          issue_text: "new text"
        })
        .end(function(err, res) {
          assert.equal(res.body, "successfully updated");
          done();
        });
    });

    test("Multiple fields to update", function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: id2,
          issue_title: "new title",
          issue_text: "new text"
        })
        .end(function(err, res) {
          assert.equal(res.body, "successfully updated");
          done();
        });
    });
  });

    suite(
      "GET /api/issues/{project} => Array of objects with issue data",
      function() {
        test("No filter", function(done) {
          chai
            .request(server)
            .get("/api/issues/test")
            .query({})
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.isArray(res.body);
              assert.property(res.body[0], "issue_title");
              assert.property(res.body[0], "issue_text");
              assert.property(res.body[0], "created_on");
              assert.property(res.body[0], "updated_on");
              assert.property(res.body[0], "created_by");
              assert.property(res.body[0], "assigned_to");
              assert.property(res.body[0], "open");
              assert.property(res.body[0], "status_text");
              assert.property(res.body[0], "_id");
              done();
            });
        });

        test("One filter", function(done) {
          chai
            .request(server)
            .get("/api/issues/test")
            .query({ created_by: "Functional Test - Every field filled in" })
            .end(function(err, res) {
              res.body.forEach(issueResult => {
                assert.equal(
                  issueResult.created_by,
                  "Functional Test - Every field filled in"
                );
              });
              done();
            });
        });

        test("Multiple filters (test for multiple fields you know will be in the db for a return)", function(done) {
          chai
            .request(server)
            .get("/api/issues/test")
            .query({
              open: true,
              created_by: "Functional Test - Every field filled in"
            })
            .end(function(err, res) {
              res.body.forEach(issueResult => {
                assert.equal(issueResult.open, true);
                assert.equal(
                  issueResult.created_by,
                  "Functional Test - Every field filled in"
                );
              });
              done();
            });
        });
      }
    );

    suite("DELETE /api/issues/{project} => text", function() {
      test("No _id", function(done) {
        chai
          .request(server)
          .delete("/api/issues/test")
          .send({})
          .end(function(err, res) {
            assert.equal(res.body, "id error");
            done();
          });
      });

      test("Valid _id", function(done) {
        chai
          .request(server)
          .delete("/api/issues/test")
          .send({
            _id: id1
          })
          .end(function(err, res) {
            assert.equal(res.body, "deleted " + id1);
          });
        chai
          .request(server)
          .delete("/api/issues/test")
          .send({
            _id: id2
          })
          .end(function(err, res) {
            assert.equal(res.body, "deleted " + id2);
            done();
          });
      });
    });
  });


  
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
