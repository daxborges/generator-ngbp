/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;


var appTester = function (gen, config, expected, cb) {
  helpers.mockPrompt(gen, {
    scriptingEngine: config.scripting || 'js',
    stylingEngine: config.styling || 'css',
    modules: []
  });

  gen.run({}, function () {
    helpers.assertFiles(expected);
    cb();
  });
};

describe('ngbp:app', function () {
  var ngbp;

  beforeEach(function (done) {

    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      var deps = [
        '../../app',
        '../../main',
      ];

      ngbp = helpers.createGenerator('ngbp:app', deps);

      // Skip installation of node modules and bower dependencies.
      ngbp.options['skip-install'] = true;

      done();
    }.bind(this));
  });

  it('creates project files', function (done) {

    // Expected files on creation.
    var expected = [
      'app/index.html',
      'app/includes/scripts.inc.html',
      'config/app.conf.json',
      'config/karma-e2e.conf.js',
      'config/karma.conf.js',
      '.bowerrc',
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      '.jshintrc',
      'bower.json',
      'Gruntfile.js',
      'package.json',
    ];

    appTester(ngbp, {}, expected, done);
  });

  it('creates css files', function (done) {
    appTester(ngbp, { styling: 'css' }, [ 'app/styles/main.css' ], done);
  });

  it('creates scss files', function (done) {
    appTester(ngbp, { styling: 'scss' }, [ 'app/styles/main.scss' ], done);
  });
});
