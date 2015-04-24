/*
 * grunt-jira-actions
 * https://github.com/jwtd/grunt-jira-actions
 *
 * Copyright (c) 2015 Jordan Duggan
 * Licensed under the MIT license.
 */

'use strict';

/*
 Jira API Docs
 https://docs.atlassian.com/jira/REST/latest/#d2e4023
 */

module.exports = function(grunt) {


  // Time grunt task execution
  require('time-grunt')(grunt);


  /*-----------------------------------------------------*
   *        Global properties for use in all tasks        *
   *------------------------------------------------------*/


  // Prepare to calculate paths
  var path = require('path');
  var root = path.resolve();

  // Create global config (gc)
  var gc = {
    env: grunt.option('env') || 'default',
    root: root,
    srcDir: 'src',
    docsSrcDir: 'docs',
    testsDir: 'test',
    configDir: 'config',
    buildDir: 'build'
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
        'tasks/**/*.js',
        '<%= gc.testsDir %>/**/*_tests.js'
      ]
    },


    nodeunit: {
      all: ['<%= gc.testsDir %>/**/*_tests.js'],
      options: {
        reporter: 'verbose'
      },
      tap: {
        options: {
          reporter: 'tap',
          reporterOutput: '<%= gc.buildDir %>/reports/tap-test-results.tap',
          reporterOptions: {
            output: '<%= gc.buildDir %>/reports'
          }
        }
      },
      ci: {
        options: {
          reporter: 'junit', // Creates jUnit compatible XML reports, which can be used with continuous integration tools such as Hudson.
          reporterOutput: '<%= gc.buildDir %>/reports/junit-test-results.xml',
          reporterOptions: {
            output: '<%= gc.buildDir %>/reports'
          }
        }
      }
    },


    /*--------------------------------*
     *       Release Management        *
     *--------------------------------*/


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

    // https://github.com/lalitkapoor/github-changes
    githubChanges: {
      dist: {
        options: {
          owner: 'jwtd',
          repository: 'grunt-jira-actions'
          //order-semver : use semantic Versioning for the ordering instead of the tag date
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


      /*- Pass Cases ------------------*/


      withMinimumOptions_should_PASS: {
        options: {
          summary: 'Issue from project_id, jira_host, summary, and defaults for everything else'}
      },


      asValidStoryDescrFromOption_should_PASS: {
        options: {
          issue_type: 'Story', // Story, Epic, Task, Technical Task, Sub-Task, Bug, Improvement, New Feature
          summary: 'Story with summary and description from a target option',
          description: 'This is the story description as string.'
        }
      },


      asValidTaskDescrFromFile_should_PASS: {
        options: {
          issue_type: 'Task', // Story, Epic, Task, Technical Task, Sub-Task, Bug, Improvement, New Feature
          summary: 'Task with summary and description from a filepath',
          description: 'test/data/issue_body.txt'
        }
      },


      asValidStoryMarkedDone_should_PASS: {
        options: {
          issue_state: 2,  // 1 = Open, 2 = Done
          summary: 'Story marked as done'
        }
      },


      asValidStoryWithPriority_should_PASS: {
        options: {
          summary: 'This is the bar task summary',
          additional_fields: {
            'priority': {
              'name': 'Major' // Critical, Major, Medium (default), Minor
            }
          }
        }
      },


      /*- Failure Cases ------------------*/


      withoutRequiredOptions_should_FAIL: {
        options: {
        }
      },


      withInvalidIssueType_should_FAIL: {
        options: {
          issue_type: 'BLARG', // Story, Epic, Task, Technical Task, Sub-Task, Bug, Improvement, New Feature
          summary: 'Should fail because BLARG is not a valid issue type'
        }
      },


      withInvalidIssueState_should_FAIL: {
        options: {
          issue_state: 42, // 1 = Open, 2 = Done
          summary: 'Should fail because 42 is not a valid issue state'
        }
      },


      withInvalidPriority_should_FAIL: {
        options: {
          summary: 'Should fail because BLARG is not a valid priority name',
          additional_fields: {
            'priority': {
              'name': 'BLARG' // Critical, Major, Medium (default), Minor
            }
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
        link_type: 'Relates',              // Blocks, Clones, Duplicate, Relates
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


      /*- Success Cases ------------------*/


      // Create specific targets to perform different Jira tasks
      fromOption_should_PASS: {
        options: {
          // issue_id: This value will be passed in via target call
          comment: 'This is the comment as a string.'
        }
      },

      // Create specific targets to perform different Jira tasks
      fromFileToIssue_should_PASS: {
        options: {
          // issue_id: This value will be passed in via target call such as addJiraComment:fromFileToIssue:19400
          comment: 'test/data/comment_body.txt'
        }
      },


      /*- Failure Cases ------------------*/


      // Create specific targets to perform different Jira tasks
      withoutContent_should_FAIL: {
        options: {
        }
      },

      // Create specific targets to perform different Jira tasks
      withoutPassingIssueId_should_FAIL: {
        options: {
          // issue_id: This value will be passed in via target call
          comment: 'This should fail, because no issue id was passed in when it was called.'
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


    // Lookup Jira project rapid view
    jiraProjectRapidView: {

      // Declare options that are common to all Jira actions
      options: {
        jira_host: 'virtru.atlassian.net'
      },

      // Create specific targets for different Jira project lookups
      forGeneralProject: {
        options: {
          project_key: 'General'
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
          search_string: 'project="WS" AND status="OPEN" AND issuetype in ("Bug", "Story")'
          //start_at: 0,
          //max_results: 3,
          //fields: {},
          //before_search: [],   // optional grunt tasks to run before search
          //after_search: []     // optional grunt tasks to run after search
        }
      }
    }

  });


  // Load from package.json
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Load this plugin's tasks
  grunt.loadTasks('tasks');


  // Project tasks
  grunt.registerTask('check', ['eslint', 'test']);
  grunt.registerTask('test', ['nodeunit']);
  grunt.registerTask('changelog', ['githubChanges']);

  grunt.registerTask('issue', ['setJiraConfig', 'createJiraIssue']);
  grunt.registerTask('transition', ['setJiraConfig', 'transitionJiraIssue']);
  grunt.registerTask('link', ['setJiraConfig', 'linkJiraIssue']);
  grunt.registerTask('comment', ['setJiraConfig', 'addJiraComment']);
  grunt.registerTask('version', ['setJiraConfig', 'createJiraVersion']);
  grunt.registerTask('project', ['jiraProjectDetails:forGeneralProject']);
  grunt.registerTask('project-view', ['jiraProjectRapidView:forGeneralProject']);
  grunt.registerTask('search', ['setJiraConfig', 'searchJira:forGenIssues']);

  grunt.registerTask('default', ['check']);

};
