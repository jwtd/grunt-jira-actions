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
  var gc = {};

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
    //clean: {
    //  tests: ['tmp']
    //},


    // Unit tests
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
          //captureFile: 'results.txt', // Optionally capture the reporter output to a file
        },
        src: ['test/**/*_tests.js']
      }
    },


    release: {
      options: {
        changelog: true, //default: false
        commitMessage: 'Release of <%= version %>',
        tagMessage: 'Version <%= version %>', //default: 'Version <%= version %>',
        //beforeBump: [],    // optional grunt tasks to run before file versions are bumped
        //afterBump: [],     // optional grunt tasks to run after file versions are bumped
        //beforeRelease: [], // optional grunt tasks to run after release version is bumped up but before release is packaged
        //afterRelease: [],  // optional grunt tasks to run after release is packaged
        github: {
          repo: '<%= pkg.repository.url.replace(\'https://github.com/\', \'\') %>', //put your user/repo here
          usernameVar: 'GITHUB_USERNAME', //ENVIRONMENT VARIABLE that contains Github username
          passwordVar: 'GITHUB_PASSWORD'  //ENVIRONMENT VARIABLE that contains Github password
        }
      }
    },


    /*--------------------------------*
     *    Setup Jira Configuration    *
     *--------------------------------*/


    setJiraConfig: {
      options: {
        env_var_for_jira_username: 'JIRA_UN',
        env_var_for_jira_password: 'JIRA_PW',
        jira_host: 'virtru.atlassian.net',
        jira_protocol: 'https',
        jira_port: 443,
        jira_api_version: '2'
      }
    },


    /*--------------------------------*
     *         Add Jira Issues        *
     *--------------------------------*/


    // Create Jira issues
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


    /*--------------------------------*
     *     Transition Jira Issue      *
     *--------------------------------*/


    transitionJiraIssue: {
      options: {
        jira_host: 'virtru.atlassian.net'
      }
    },


    /*--------------------------------*
     *       Link Jira Issues         *
     *--------------------------------*/


    // linkJiraIssue:GEN-200:Relates:GEN-201
    linkJiraIssue: {
      options: {
        jira_host: 'virtru.atlassian.net',
        from_issue_key: 'GEN-345',
        link_type: 'Relates',              // Blocks, Cloners, Duplicate, Relates
        to_issue_key: 'GEN-123',
        comment: 'This is a test link'
      }
    },


    /*--------------------------------*
     *       Add Jira Comments        *
     *--------------------------------*/


    // Add comments to existing Jira issues
    addJiraComment: {

      // Declare options that are common to all Jira actions
      options: {
        jira_host: 'virtru.atlassian.net'
      },

      // Create specific targets to perform different Jira tasks
      onIssue: {
        options: {
          // issue_id: This value will be passed in via target call
          comment: 'This is a comment on the story.'
        }
      },

      // Create specific targets to perform different Jira tasks
      fromFileToIssue: {
        options: {
          // issue_id: This value will be passed in via target call such as addJiraComment:fromFileToIssue:19400
          comment: 'test/data/comment_body.txt'
        }
      }

    },


    /*--------------------------------*
     *    Create a Project Version    *
     *--------------------------------*/


    // Create a Version of a Jira project
    createJiraVersion: {

      // Declare options that are common to all Jira actions
      options: {
        jira_host: 'virtru.atlassian.net'
      },

      // Create specific targets for different Jira projects
      general: {
        options: {
          project_key: 'GEN',
          name: 'New Version 1',
          description: 'test/data/version_description.txt',
          archived: false,
          released: true,
          release_date: '2015-02-21'
          //userReleaseDate: '5/Jul/2010'
        }
      }
    },


    /*--------------------------------*
     *   Lookup Jira project details  *
     *--------------------------------*/


    // Lookup Jira project details
    jiraProjectDetails: {

      // Declare options that are common to all Jira actions
      options: {
        jira_host: 'virtru.atlassian.net'
      },

      // Create specific targets for different Jira project lookups
      forGeneralProject: {
        options: {
          project_key: 'GEN'
        }
      }
    },


    /*--------------------------------*
     *     Search Jira using JQL      *
     *--------------------------------*/


    // Search Jira for specific issues
    searchJira: {

      // Declare options that are common to all Jira actions
      options: {
        jira_host: 'virtru.atlassian.net'
      },

      // Create specific targets for different Jira searches
      //    /rest/api/2/search?
      //      jql=
      //        project=WS
      //        +AND+status=%22OPEN%22
      //        +AND+issuetype+in%20(%22Bug%22,%22Story%22)
      forGenIssues: {
        options: {
          search_string: 'project="WS" AND status="OPEN" AND issuetype in ("Bug","Story")',
          //start_at: 0,
          //max_results: 3,
          //fields: {},
          //before_search: [],    // optional grunt tasks to run before search
          //after_search: []     // optional grunt tasks to run after search
        }
      }
    }


    /*
     Jira API Docs
     https://docs.atlassian.com/jira/REST/latest/#d2e4023

     Project : /rest/api/2/project/{projectIdOrKey}
     Project Versions : /rest/api/2/project/{projectIdOrKey}/versions
     Project Properties : /rest/api/2/project/{projectIdOrKey}/properties
     Project Version Issues:
       /jira/rest/api/2/version/{id}/relatedIssueCounts
       /jira/rest/api/2/version/{id}/unresolvedIssueCount
    */

  });


  // Load from package.json
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');


  // Whenever the 'test' task is run, first clean the 'tmp' dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['mochaTest']);


  // By default, lint and run all tests.
  //grunt.registerTask('default', ['eslint', 'test']);
  //grunt.registerTask('default', 'createJiraIssue:createAndCloseFooStory');
  grunt.registerTask('default', ['setJiraConfig', 'searchJira:forGenIssues']);

};
