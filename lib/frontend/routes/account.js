var user = require('../../resources/user'),
    view = require('view').view;

module['exports'] = function (app) {
  app.get('/account', function (req, res, next) {

    if (typeof req.session.sessionID === 'undefined') {
      return res.redirect(301, '/login');
    }
    
    user.find({ name: req.session.name }, function (err, results){
      if (err) {
        return res.end('Invalid session: ' + req.session.sessionID);
      }
      app.view['account'].present({ data: results[0] }, function(err, html){
        res.end(html);
      });
    });

  });

  app.post('/account', function (req, res, next) {

    if (typeof req.session.sessionID === 'undefined') {
      return res.redirect(301, '/login');
    }

    var params = req.resource.params;

    if (params.password !== params.confirmPassword) {
      return res.end('passwords do not match.');
    }

    if (params.password.length === 0) {
      delete params.password;
    }

    user.find({ name: req.session.name }, function(err, results){
      var record = results[0];
      for (var param in params) {
        if (param !== 'name' && param !== 'id') {
          record[param] = params[param];
        }
      }

      user.update(record, function(){
        app.view['account'].present({ data: record, updated: true }, function(err, html){
          res.end(html);
        });
      });

    });

  });
  
};