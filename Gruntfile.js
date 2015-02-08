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


    /*--------------------------------*
     *         Jira Actions           *
     *--------------------------------*/


    // Configuration to be run (and then tested).
    createJiraIssue: {

      // Declare options that are common to all Jira actions
      options: {
        jira_host: 'virtru.atlassian.net',
        project_id: 10400
      },

      // Create specific targets to perform different Jira tasks
      createAndCloseFooStory: {
        options: {
          issue_type: 'Story', // Story, Epic, Task, Technical Task, Sub-Task, Bug, Improvement, New Feature
          issue_state: 1,      // 1 = Open, 2 = Done
          summary: 'This is the foo story summary',
          description: 'This is the foo story description.'
        }
      },

      // Create specific targets to perform different Jira tasks
      createOpenBarTask: {
        options: {
          issue_type: 'Task',
          issue_state: 2,     // 1 = Open, 2 = Done
          summary: 'This is the bar task summary',
          description: 'test/data/issue_body.txt',
          optional_fields: {
            'priority': {
              'name': 'Major' // Critical, Major, Medium (default), Minor
            },
            'components': [{
              'id': '10804'
            }]
          }
        }
      }

    },

    // https://virtru.atlassian.net/rest/api/latest/search?jql=project=WS+AND+status=%22OPEN%22+AND+issuetype+in%20(Bug,%20%22Story%22)

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


  // Whenever the 'test' task is run, first clean the 'tmp' dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'createJiraIssue', 'nodeunit']);


  // By default, lint and run all tests.
  //grunt.registerTask('default', ['eslint', 'test']);
  //grunt.registerTask('default', 'createJiraIssue:createAndCloseFooStory');
  grunt.registerTask('default', 'createJiraIssue:createOpenBarTask');

};
