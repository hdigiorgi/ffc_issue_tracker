/*
*
*
*       FILL IN EACH UNIT TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]----
*       (if additional are added, keep them at the very end!)
*/

const issue = require('../issue');
const {assert} = require('chai');

const inputProject = 'awesome-project';
var inputIssue = {
    issue_title: 'test title', 
    issue_text: 'test text', 
    created_by: 'created by someone', 
    assigned_to: 'assigned to someone', 
    status_text: 'some status'
}

suite('Unit Tests', () => {
    var created = null;

    test('create new', done => {
        setTimeout(done, 15000);
        issue.create(inputProject, inputIssue).then( r => {
            assert.equal(r.projectName, inputProject)
            assert.equal(r.title, inputIssue.issue_title)
            assert.equal(r.createdBy, inputIssue.created_by)
            assert.equal(r.assignedTo, inputIssue.assigned_to)
            assert.equal(r.status, inputIssue.status_text)
            assert.equal(r.open, true)
            assert.exists(r._id)
            assert.exists(r.createdOn)
            assert.exists(r.updatedOn)
            assert.strictEqual(r.createdOn.getTime(), r.updatedOn.getTime())
            created = r;
            done();
        })
    });

    test('update existing', done => {
        setTimeout(done, 15000);
        const modifications = {
            issue_title: 'modified title', 
            issue_text: 'modified text', 
            created_by: 'created by other', 
            assigned_to: 'assigned to someone else', 
            status_text: 'other status',
            open: false
        }
        issue.update(inputProject, created._id, modifications).then(updateRes => {
            assert.equal(updateRes, 'successfully updated')
            issue.getById(created._id).then(modified => {
                assert.equal(modified.projectName, inputProject)
                assert.equal(modified.title, modifications.issue_title)
                assert.equal(modified.createdBy, modifications.created_by)
                assert.equal(modified.assignedTo, modifications.assigned_to)
                assert.equal(modified.status, modifications.status_text)
                assert.equal(modified.open, modifications.open)
                assert.strictEqual(modified.createdOn.getTime(), created.createdOn.getTime())
                assert.notStrictEqual(modified.updatedOn.getTime(), created.updatedOn.getTime())
                done();
            })
        })
    })

    test('get existing', done => {
        setTimeout(done, 15000);
        issue.get(inputProject + "__non_existing__").then(r => {
            assert.lengthOf(r, 0)
        })
        .then(() => issue.get(inputProject))
        .then(r => {
            assert.isArray(r)
            assert.isOk(r.length >= 1)
            r.forEach(item => {
                assert.strictEqual(item.projectName, inputProject)
            })
            done();
        })
    })

    test('delete existing', done => {
        setTimeout(done, 15000);
        issue.remove(inputProject, created._id).then(r => {
            assert.strictEqual(r, `deleted ${created._id}`);
        }).then(_ => {
            return issue.getById(created._id)
        }).then(search => {
            assert.equal(search, null);
            done();
        })
    })

});