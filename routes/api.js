/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const issue = require('../issue');

function response(res, promise) {
  promise.then(data => {
    if (data.error) {
      res.status(400).json(data.error);
    } else {
      res.json(data.result);
    }
  }, _ => {
    res.status(500).json('internal error');
  })
  
}

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      response(res,
        issue.get(req.params.project, req.query))
    })
    
    .post(function (req, res){
      response(res,
        issue.create(req.params.project, req.body))
    })
    
    .put(function (req, res){
      response(res,
        issue.update(req.params.project, req.body._id, req.body))
    })
    
    .delete(function (req, res){
      response(res,
        issue.remove(req.params.project, req.body._id))
    });
    
};
