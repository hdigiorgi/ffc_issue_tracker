/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    const testProject = 'test';
    var created = null;
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post(`/api/issues/${testProject}`)
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          created = res.body;
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post(`/api/issues/${testProject}`)
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post(`/api/issues/${testProject}`)
        .send({
          issue_title: 'Title',
          issue_text: 'text'
        })
        .end(function(err, res){
          assert.equal(res.status, 400);
          done();
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put(`/api/issues/${testProject}`)
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.body, 'no updated field sent')
          done();
        });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put(`/api/issues/${testProject}`)
        .send({
          _id: created._id,
          issue_text: "udpated issue text"
        })
        .end(function(err, res){
          assert.equal(res.body, 'successfully updated')
          assert.equal(res.status, 200);
          done();
        });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put(`/api/issues/${testProject}`)
        .send({
          _id: created._id,
          created_by: "createdBy changed",
          assigned_to: "assignedTo changed"
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body, 'successfully updated')
          done();
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get(`/api/issues/${testProject}`)
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          res.body.forEach(elem => {
            assert.exists(elem.title);
            assert.exists(elem.text);
            assert.exists(elem.createdOn);
            assert.exists(elem.updatedOn);
            assert.exists(elem.createdBy);
            assert.exists(elem.assignedTo);
            assert.exists(elem.open);
            assert.exists(elem.status);
            assert.exists(elem._id);
          })
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get(`/api/issues/${testProject}`)
        .query({_id: created._id})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.lengthOf(res.body, 1)
          assert.strictEqual(res.body[0]._id, created._id)
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get(`/api/issues/${testProject}`)
        .query({open: true, projectName: testProject})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.isOk(res.body.length > 1)
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete(`/api/issues/${testProject}`)
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 400)
          assert.strictEqual(res.body, 'no _id field sent')
          done();
        });
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete(`/api/issues/${testProject}`)
        .send({_id: created._id})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.strictEqual(res.body, `deleted ${created._id}`)
          done();
        });
      });
      
    });

});
