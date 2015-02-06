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

      // Declare options that are common to all Jira actions
      options: {
        jira: {   //https://virtru.atlassian.net/rest/api/latest/search?jql=project=WS+AND+status=%22OPEN%22+AND+issuetype+in%20(Bug,%20%22Story%22)
          api_url: "https://virtru.atlassian.net/rest/api/2/" //,
          //proxy : null,
          //user: "your-username",     // Bad practice - You should pull JIRA_UN from ENV
          //password: "your-password"  // Bad practice - You should pull JIRA_PW from ENV
        }
      },

      // Create specific targets to perform different Jira tasks
      createOpenFooStory: {
        issue: {
          project_id: 10400,
          type_id: 7,                 // 7 = Story
          state: 11,                   // 1 = Open, 11 = Done
          summary: "Foo Project",
          description: 'This is a description of what you want'//,
          //description: 'path/to/some.json'
          //name: "Foo Project",
          //version: "1.0.1",
          //build_label: "foo_project_1.0.1.7890"
          //components: ['ACM']           // This value will be passed as a Jira field
        }
      },

      // Create specific targets to perform different Jira tasks
      createOpenFooTask: {
        issue: {
          project_id: 10400,
          type_id: 7,                 // 7 = Story
          state: 11,                   // 1 = Open, 11 = Done
          summary: "Foo Project",
          description: 'This is a description of what you want'//,
          //description: 'path/to/some.json'
          //name: "Foo Project",
          //version: "1.0.1",
          //build_label: "foo_project_1.0.1.7890"
          //components: ['ACM']           // This value will be passed as a Jira field
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
  grunt.registerTask('default', 'createJiraIssue:general');


};
