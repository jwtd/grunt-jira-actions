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
    createJiraIssue: {
      options: {
        jira: {
          api_url: "https://company.atlassian.net/rest/api/2/",
          proxy : null,
          user: "your-username",     // Bad practice - You should pull JIRA_UN from ENV
          password: "your-password"  // Bad practice - You should pull JIRA_PW from ENV
        },
        project: {
          jira_id: 123456,
          name: "Foo Project",
          version: "1.0.1",
          build_label: "foo_project_1.0.1.7890"
        },
        issue: {
          type_id: 7,                 // 7 = Story
          state: 1,                   // 1 = Open, 11 = Done
          summary: "Foo Project",
          //description: 'path/to/some.json'
          description: 'This is a description of what you want',
          components: 'ACM'           // This value will be passed as a Jira field
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
  //grunt.registerTask('default', ['eslint', 'test']);
  grunt.registerTask('default', 'createJiraIssue');


};
