'use strict';

/**
 * Required Node Packages to work.
 */
var util    = require('util');
var path    = require('path');
var yeoman  = require('yeoman-generator');


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
    path.join('app', dest) + this.scriptExt
  ]);
};
