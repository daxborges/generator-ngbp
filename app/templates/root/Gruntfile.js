'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically.
  require('load-grunt-tasks')(grunt);

  // Load Grunt tasks automatically.
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take.
  require('time-grunt')(grunt);

  // Define configuration for all tasks.
  grunt.initConfig({

    /*
     * Variables.
     */

    // Source and deployment folders.
    yeoman: {
      app: 'app',
      dist: 'dist'
    },



    /*
     * Helper tasks.
     */

    // Watch files for changes and run specific tasks.
    watch: {
      coffee: {
        files: [ '<%%= coffee.tmp.cwd %>/<%%= coffee.tmp.src %>'],
        tasks: [ 'newer:coffee:tmp' ]
      },
      compass: {
        files: [ '<%%= compass.options.sassDir %>/**/*.{scss,sass}' ],
        tasks: [ 'compass:tmp', 'autoprefixer' ]
      },
      htmlIncludes: {
        files: [ '<%%= includes.tmp.src %>', 'app/includes/*.html' ],
        tasks: [ 'newer:includes:tmp' ]
      },
      styles: {
        files: [ '<%%= yeoman.app %>/styles/{,*/}*.css' ],
        tasks: [ 'newer:copy:styles', 'autoprefixer' ]
      },
      livereload: {
        options: {
          livereload: '<%%= connect.options.livereload %>'
        },
        files: [
          '.tmp/**/*',
          '<%%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
        ]
      }
    },

    // Run some tasks in parallel to speed up the build process.
    concurrent: {
      tmp: [
        'includes:tmp',
        'coffee:tmp',
        'compass:tmp',
        'copy:styles'
      ],
    },



    /*
     * Tasks.
     */

    // Add vendor prefixes to stylesheets.
    autoprefixer: {
      options: {
        browsers: [ 'last 2 versions' ]
      },
      styles: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the index.
    'bower-install': {
      app: {
        html: '<%%= yeoman.app %>/index.html',
        ignorePath: '<%%= yeoman.app %>'
      }
    },

    // Empties folders to start fresh.
    clean: {
      tmp: '.tmp'
    },

    // Compiles CoffeeScript files into JavaScript.
    coffee: {
      options: {
        sourceMap: true,
        sourceRoot: '.'
      },
      tmp: {
        expand: true,
        cwd: '<%%= yeoman.app %>',
        src: '**/*.coffee',
        dest: '.tmp',
        ext: '.js'
      }
    },

    // Compiles Sass to CSS.
    compass: {
      options: {
        sassDir: '<%%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%%= yeoman.app %>/images',
        fontsDir: '<%%= yeoman.app %>/fonts',
        importPath: '<%%= yeoman.app %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/fonts',
        relativeAssets: false,
        assetCacheBuster: false
      },
      dist: {
        options: {
          generatedImagesDir: '<%%= yeoman.dist %>/images/generated'
        }
      },
      tmp: {
        options: {
          debugInfo: true
        }
      }
    },

    // Copies folders and/or files to places other tasks can use.
    copy: {

      // Copy styles folder to .tmp to autoprefix them.
      styles: {
        expand: true,
        cwd: '<%%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*}*.css'
      },
    },

    // Start a local server to preview files.
    connect: {
      options: {
        port: 1717,
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%%= yeoman.app %>'
          ]
        }
      }
    },

    // Build HTML includes.
    includes: {
      tmp: {
        src: [ 'app/index.html' ],
        dest: '.tmp',
        flatten: true
      }
    },

  });



  /*
   * Custom tasks.
   */

  // Serve static files to development environment.
  grunt.registerTask('serve', function () {
    grunt.task.run([
      'clean:tmp',
      'concurrent:tmp',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  // Minify and concatenate assets to create a production build.
  grunt.registerTask('build', [
  ]);
};
