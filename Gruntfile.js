/*
 * grunt-jira-tasks
 * https://github.com/jwtd/grunt-jira-tasks
 *
 * Copyright (c) 2015 Jordan Duggan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {


  // Time grunt task execution
  require('time-grunt')(grunt);


  /*-----------------------------------------------------*
   *        Global properties for use in all tasks        *
   *------------------------------------------------------*/


  // Create global config (gc)
  var gc = {
    jiraUsername: process.env.JIRA_UN,
    jiraPassword: process.env.JIRA_PW
  };


  // Project configuration.
  grunt.initConfig({


    // Pull in the package details
    pkg: grunt.file.readJSON('package.json'),

    // Common paths for our tasks to use
    gc: gc,


    /*--------------------------------*
     *        Code Conventions        *
     *--------------------------------*/


    eslint: {
      options: {
        config: 'eslint.json'
      },
      target: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ]
    },


    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },


    // Configuration to be run (and then tested).
    jiraTasks: {
      default_options: {
        options: {
        },
        files: {
          'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123']
        }
      },
      custom_options: {
        options: {
          separator: ': ',
          punctuation: ' !!!'
        },
        files: {
          'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123']
        }
      }
    },


    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }


  });


  /*------------------------------------------------*
   *       Load grunt tasks from package.json       *
   *------------------------------------------------*/

  // Load from package.json
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');


  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'jira_tasks', 'nodeunit']);


  // By default, lint and run all tests.
  grunt.registerTask('default', ['eslint', 'test']);


};
