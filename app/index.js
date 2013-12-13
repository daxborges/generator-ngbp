'use strict';

/**
 * Required Node Packages to work.
 */
var util    = require('util');
var path    = require('path');
var yeoman  = require('yeoman-generator');
var chalk   = require('chalk');
var wiredep = require('wiredep');
var fs      = require('fs');


var NgbpGenerator = module.exports = function NgbpGenerator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  /**
   * Figure out app name.
   * package.json, bower.json and submodules preffix will be the app name.
   * If the user run the generator with a given app name `yo ngbp my-app`,
   * then we will use that name. Elsewhere, we will use current directory name.
   */
  this.argument('appname', { type: String, required: false });
  this.appname = this.appname || path.basename(process.cwd());
  this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

  /**
   * Prompts placeholder to use in the generator..
   */
  this.prompts = [];

  /**
   * Call subgenerators after running the generator.
   */
  args = [ this.appname ];
  this.hookFor('ngbp:main', { args: args });

  /**
   * After running the generator, install the dependencies if the user
   * didn't disabled the action and inject bower dependencies on index
   * file.
   */
  this.on('end', function () {
    this.installDependencies({
      skipInstall: options['skip-install'],
      callback: this._injectDependencies.bind(this)
    });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(NgbpGenerator, yeoman.generators.Base);


/**
 * Show welcome message to the user, including Yeoman greet.
 */

NgbpGenerator.prototype.welcome = function welcome() {
  console.log(this.yeoman);
  console.log(
    'Welcome to the ng-boilerplate generator.\n\n',
    'Out of the box I include:\n',
    '* ui-router for routing purposes.',
    '\n'
  );
};


/**
 * Ask for pre-processor engines configuration.
 * The user can use sass instead of css or coffee
 * instead of plain JavaScript.
 */
NgbpGenerator.prototype.askForEngines = function askForEngines() {
  var cb = this.async();

  var prompts = [{
    type:  'list',
    name: 'scriptingEngine',
    message: 'Which JavaScript preprocessor do you want to use?',
    choices: [{
      value: 'js',
      name: 'Plain JavaScript',
    }, {
      value: 'coffee',
      name: 'CoffeeScript',
    }]
  }, {
    type:  'list',
    name: 'stylingEngine',
    message: 'Which CSS preprocessor do you want to use?',
    choices: [{
      value: 'css',
      name: 'Vanilla CSS',
    }, {
      value: 'scss',
      name: 'Sass (with Compass)',
    }]
  }];

  this.prompt(prompts, function (props) {
    this.prompts.engines = props;

    cb();
  }.bind(this));
};


/**
 * Ask the user which Angular modules want to include on
 * the application.
 */
NgbpGenerator.prototype.askForModules = function askForModules() {
  var cb = this.async();

  var prompts = [{
    type: 'checkbox',
    name: 'modules',
    message: 'Which Angular modules would you like to include?',
    choices: [{
      value: 'angularUi',
      name: 'Twitter Bootstrap for Angular (Angular UI)',
      checked: true
    }, {
      value: 'restangular',
      name: 'Restangular',
      checked: true
    }, {
      value: 'cookies',
      name: 'angular-cookies.js',
      checked: false
    }, {
      value: 'sanitize',
      name: 'angular-sanitize.js',
      checked: false
    }]
  }];

  this.prompt(prompts, function (props) {
    var hasMod = function (mod) { return props.modules.indexOf(mod) !== -1; };
    this.bootstrapModule = hasMod('angularUi');
    this.restangularModule = hasMod('restangular');
    this.cookiesModule = hasMod('cookies');
    this.sanitizeModule = hasMod('sanitize');

    /*
     * Buffer enabled modules to inject them to our app module.
     */
    var angmods = [
      '\'ui.router\''
    ];

    if (this.bootstrapModule) {
      angmods.push('  \'ui.bootstrap\'');
    }

    if (this.restangularModule) {
      angmods.push('  \'restangular\'');
    }

    if (this.cookiesModule) {
      angmods.push('  \'ngCookies\'');
    }

    if (this.sanitizeModule) {
      angmods.push('  \'ngSanitize\'');
    }

    /*
     * Concatenate each angular module and add a comma to
     * inject it to out app manifest.
     */
    this.env.options.angularDeps = angmods.join(',\n') + ',';

    cb();
  }.bind(this));
};


/**
 * Bootstrap root files.
 */
NgbpGenerator.prototype.bootstrapRoot = function bootstrapRoot() {
  this.copy('root/bowerrc', '.bowerrc');
  this.copy('root/editorconfig', '.editorconfig');
  this.copy('root/gitattributes', '.gitattributes');
  this.copy('root/gitignore', '.gitignore');
  this.copy('root/jshintrc', '.jshintrc');
  this.copy('root/Gruntfile.js', 'Gruntfile.js');
  this.template('root/_bower.json', 'bower.json');
  this.template('root/_package.json', 'package.json');
};


/**
 * Bootstrap configuration files.
 */
NgbpGenerator.prototype.bootstrapConfig = function bootstrapConfig() {
  this.copy('config/karma-e2e.conf.js', 'config/karma-e2e.conf.js');
  this.copy('config/karma.conf.js', 'config/karma.conf.js');
  this.template('config/app.conf.json', 'config/app.conf.json');
};


/**
 * Bootstrap application files, based on
 * engines prompts.
 */
NgbpGenerator.prototype.bootstratApp = function bootstratApp() {

  // Figure out files extension.
  var styling = this.prompts.engines.stylingEngine;


  this.mkdir('app');
  this.template('app/index.html', 'app/index.html');
  this.copy('app/scripts.inc.html', 'app/includes/scripts.inc.html');
  this.copy('app/' + styling + '/main.' + styling, 'app/styles/main.' + styling);
};

/**
 * Inject bower dependencies to index files before installing.
 */
NgbpGenerator.prototype._injectDependencies = function _injectDependencies() {
  var installMessage =
    '\nAfter running `npm install & bower install`, inject your' +
    '\nBower dependencies in your index file by running:\n\n' +
    chalk.yellow.bold('grunt bower-install');

  if (this.options['skip-install']) {
    console.log(installMessage);
  }
  else {
    wiredep({
      directory: 'app/bower_components',
      bowerJson: JSON.parse(fs.readFileSync('./bower.json')),
      ignorePath: 'app/',
      htmlFile: 'app/index.html'
    });
  }
};
