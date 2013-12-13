'use strict';

module.exports = function (grunt) {

  // Load Grunt tasks automatically.
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take.
  require('time-grunt')(grunt);

  // Define configuration for all tasks.
  grunt.initConfig({

    // Read package.json.
    pkg: grunt.file.readJSON('package.json'),

    // Watch files for changes and run specific tasks.
    watch: {
      js: {
        files: '<%= jshint.all %>',
        tasks: [ 'newer:jshint:all' ]
      },
      test: {
        files: [ '<%= cafemocha.all.src %>' ],
        tasks: [ 'newer:cafemocha:all' ]
      }
    },

    // Run Mocha tests.
    cafemocha: {
      all: {
        src: 'test/*.spec.js',
        options: {
          ui: 'bdd'
        }
      }
    },

    // Validate JS files.
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '{,*/}*.js',
        '!**/node_modules/**'
      ]
    },
  });

  // Test and lint generator source.
  grunt.registerTask('test', [ 'jshint', 'cafemocha' ]);
};
