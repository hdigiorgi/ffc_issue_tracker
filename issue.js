const mongoose = require('mongoose');
const model = mongoose.model;
var Schema = mongoose.Schema;

require('dotenv').config()
mongoose.connect(process.env.DB, {useNewUrlParser: true});

const IssueSchema = new Schema({
    title: {type: String, required: true},
    text: {type: String, required: true},
    createdBy: {type: String, required: true},
    assignedTo: {type: String, required: false, default: ''},
    status: {type: String, required: false, default: ''},
    updatedOn: {type: Date, required: true},
    createdOn: {type: Date, required: true},
    open: {type: Boolean, required: true, default: true},
    projectName: {type: String, required: true}
});

const Issue = model('issue', IssueSchema);

function create(projectName, {issue_title, issue_text, created_by, assigned_to, status_text}) {
    if(!issue_title || !issue_text || !created_by) { return new Promise((r) => {
        r({error: 'required fields missing'})
    })}
    const now = new Date()
    return Issue.create({
        projectName: projectName,
        title: issue_title,
        text: issue_text,
        createdBy: created_by,
        assignedTo: assigned_to,
        status: status_text,
        createdOn: now,
        updatedOn: now
    }).then(x => ({result: x._doc}))
}

function update(projectName, issueId, {issue_title, issue_text, created_by, assigned_to, status_text, open} = {}) {
    var updateObj = {};
    if(issue_title) updateObj.title = issue_title;
    if(issue_text) updateObj.text = issue_text;
    if(created_by) updateObj.createdBy = created_by;
    if(assigned_to) updateObj.assignedTo = assigned_to;
    if(status_text) updateObj.status = status_text;
    if(open != undefined) updateObj.open = open;
    if(Object.keys(updateObj).length <= 0) { return new Promise((r) => {
        r({error: 'no updated field sent'})
    })}
    if(!issueId) { return new Promise((r) => {
        r({error: 'no id sent'})
    })}
    updateObj.updatedOn = new Date();
    
    function doUpdate(done) {
        Issue.findOneAndUpdate({projectName, _id: issueId}, updateObj)
            .exec((err, data) => {
                if(err) done({error: `cound not update ${JSON.stringify(err)}`})
                else done({result: 'successfully updated'})
            })
    }

    return new Promise(doUpdate)
}

function remove(projectName, issueId) {
    if(!issueId) { return new Promise((r) => {
        r({error: 'no _id field sent'})
    })}

    function doRemove(done) {
        Issue.findOneAndDelete({projectName, _id: issueId})
            .exec((err, data) => {
                if(err) done({error: `cound not delete ${issueId}`})
                else done({result: `deleted ${issueId}`})
            })
    }

    return new Promise(doRemove)
}

function getById(issueId) {
    function doSearch(done) {
        Issue.findOne({_id: issueId})
            .exec((err, data) => {
                if(err) done(err)
                else done(data)
            })
    }

    return new Promise(doSearch)
}

function get(projectName, {_id, issue_title, issue_text, created_by, assigned_to, status_text, open} = {}) {
    var searchObj = {projectName}
    if(issue_title) searchObj.title = issue_title;
    if(issue_text) searchObj.text = issue_text;
    if(created_by) searchObj.createdBy = created_by;
    if(assigned_to) searchObj.assignedTo = assigned_to;
    if(status_text) searchObj.status = status_text;
    if(_id) searchObj._id = _id;
    if(open != undefined) searchObj.open = open;

    function doSearch(done) {
        Issue.find(searchObj)
            .exec((err, data) => {
                if(err) done({error})
                else if(data) done({result: data})
                else done({result: []})
            })
    }

    return new Promise(doSearch)
}

module.exports = {create, update, remove, get, getById};