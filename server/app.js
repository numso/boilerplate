/* jshint node:true */
'use strict';

var       fs = require('fs'),
     express = require('express'),
      stylus = require('stylus'),
      config = require('config');

var app = express();
app.set('port', process.env.PORT || 3000);

var sessOptions = config.sessOptions;

function addFail(req, res, next) {
  res.fail = function (err) {
    res.send({
      success: false,
      err: err
    });
  };
  next();
}

var devConfig = function () {
  app.use(express.favicon());
  app.use(stylus.middleware({
    debug: true,
    src: 'client',
    dest: 'client'
  }));
  app.use(express.static('client'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session(sessOptions));
  app.use(addFail);
  app.use(app.router);
  app.use(express.errorHandler());
};
app.configure('development', devConfig);
app.configure('localdev', devConfig);

var prodConfig = function () {
  app.use(express.favicon());
  app.use(express.static('build'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session(sessOptions));
  app.use(addFail);
  app.use(app.router);
};
app.configure('staging', prodConfig);
app.configure('production', prodConfig);

// -+- Load all the middlewares +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
app.mw = {};
fs.readdirSync(__dirname + '/middleware').forEach(
  function (file) {
    require('./middleware/' + file)(app);
  }
);

// -+- Load all the routes -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
fs.readdirSync(__dirname + '/routes').forEach(function (file) {
  require('./routes/' + file)(app);
});

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port') + ' in environment ' + app.get('env'));
});
