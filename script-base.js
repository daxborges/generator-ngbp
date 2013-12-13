'use strict';

/**
 * Required Node Packages to work.
 */
var util    = require('util');
var path    = require('path');
var yeoman  = require('yeoman-generator');
var utils   = require('./util');
var chalk   = require('chalk');


/**
 * This file is intended to be used by the subgenerators
 * in order to add scripts to index, copy files, etc.
 */
var ScriptBase = module.exports = function ScriptBase() {
  yeoman.generators.NamedBase.apply(this, arguments);

  /**
   * Figure out app name.
   */
  try {
    this.appname = require(path.join(process.cwd(), 'bower.json')).name;
  }
  catch (e) {
    this.appname = process.cwd();
  }

  this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));


  /**
   * Figure out current source's module name.
   */
  if (this.name.indexOf('.') !== -1) {

    /**
     * Generates an array of the destination path,
     * adding app/ at the start.
     * Example: profile.edit.infoCtrl = [ app, profile, edit, infoCtrl ]
     */
    this.destPath = ('app.' + this.name).split('.');

    /**
     * Removes the last word in order to figure
     * out the name of the module container for the current resource.
     * Example: profile.edit.infoCtrl = profile.edit
     */
    this.moduleName = this.name.replace(/\.\w+$/, '');
  }
  else {

    /**
     * Generates an array of the destination path,
     * adding common/ at the start.
     * Example: generalCtrl = [ common, generalCtrl ]
     */
    this.destPath = ('common.' + this.name).split('.');

    /*
     * Because of the current resource will be commonly used,
     * then the module name will be the same as the app name.
     */
    this.moduleName = this.appname;
  }

  /**
   * Extract the file name from the dest path array by
   * taking the last item.
   * Example: [ app, profile, edit, infoCtrl ] = infoCtrl
   */
  this.name = this.destPath.pop();

  /**
   * Concatenate the dest path in order to figure out
   * the container route for the resource.
   * Example: [ app, profile, edit ] = app/profile/edit
   */
  this.destPath = this.destPath.join('/');

  /**
   * Camelize the resource name for all subgenerator types
   * except for services.
   *
   * Classify the resource name only for service type subgenerators.
   */
  this.cameledName = this._.camelize(this.name);
  this.classedName = this._.classify(this.name);


  /**
   * Figure out scripting engine.
   */
  try {
    this.scriptExt = require(path.join(process.cwd(), 'config/app.conf.json')).engines.scripting;
    this.scriptPath = this.scriptExt;
    this.scriptExt = '.' + this.scriptExt;
  }
  catch (e) {
    this.scriptExt = '.js';
    this.scriptPath = 'js';
  }


  /**
   * Establish templates directory for scripts,
   * based on engines configuration.
   */
  this.sourceRoot(path.join(__dirname, '/templates', this.scriptPath));
};

util.inherits(ScriptBase, yeoman.generators.NamedBase);


/*
 * Copy an app template.
 */
ScriptBase.prototype.appTemplate = function (src, dest) {
  yeoman.generators.Base.prototype.template.apply(this, [
    src + this.scriptExt,
    dest + this.scriptExt
  ]);
};


/**
 * Add a script reference to scripts manifest file.
 */
ScriptBase.prototype.addScriptToIndex = function (script) {
  var src = 'app/includes/scripts.inc.html';

  try {
    utils.rewriteFile({
      file: src,
      needle: '<!-- endbuild -->',
      splicable: [
        '<script src="' + script.replace('app/', '') + '.js"></script>'
      ]
    });
  }
  catch (e) {
    console.log('\n' + chalk.yellow.bold('WARNING: ') + 'Unable to find ' + chalk.bold(src) + '. Reference to ' + chalk.bold(script + '.js') + ' not added.\n');
  }
};


/**
 * Generate a file and it's respective test.
 */
ScriptBase.prototype.generateSourceAndTest = function (appTemplate, suffix, testTemplate, targetDirectory, commonDirectory) {

  var name;
  var targetPath;

  switch (appTemplate) {

    /**
     * If the current resource it's a service, then
     * Classify the result file name.
     */
    case 'constant':
    case 'factory':
    case 'provider':
    case 'service':
    case 'value':
      name = this.classedName;
      break;

    /**
      * If the current resource isn't a service, then
      * camelCase the result file name.
      */
    default:
      name = this.cameledName;
      break;
  }

  /**
   * Add the current script suffix.
   * Example: Ctrl, Filter, Directive, Constant, Factory, Provider, Service, Value
   */
  name = name + suffix;


  /**
   * If the target directory contains the word 'common',
   * then add at the end the resource type.
   * Example: common/controllers/, common/filters/, common/services/, common/directives
   */
  if (targetDirectory.indexOf('common') !== -1) {
    targetPath = targetDirectory = path.join(targetDirectory, commonDirectory);
  }

  /**
   * If the target directory didn't contains the word 'common',
   * then only prepend it the word 'app'.
   * Example: 'profile/edit' => 'app/profile/edit'.
   */
  else {
    targetPath = path.join('app', targetDirectory);
  }

  this.appTemplate(appTemplate, path.join('app', targetDirectory, name));
  this.addScriptToIndex(path.join(targetPath, name));
};
