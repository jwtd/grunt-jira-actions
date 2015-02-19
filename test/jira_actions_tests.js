"use strict";
var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

// Nock recorder
var record = require('./record');

// Get a handle on grunt
var grunt = require('grunt');

// Bypass the need to load a Gruntfile
grunt.task.init = function() {};


describe('Create Jira Issue', function () {
  var recorder = record('create_jira_issue');
  before(recorder.before);

  it('should register itself with Grunt', function () {

    // Project configuration.
    grunt.initConfig({
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

      }
    });


    // Actually load this plugin's task(s).
    grunt.loadTasks('../tasks');

    // Make sure the task was loaded
    grunt.task._tasks['createJiraIssue'].should.exist;

    // Finally run the tasks, with options and a callback when we're done
    grunt.tasks(['createJiraIssue:createOpenBarTask'], {}, function() {
      grunt.log.ok('Done running tasks.');
    });

  });

  // Capture the fixture recording if it was created
  after(recorder.after);
});


//describe('Transition Jira issue', function () {
//  var recorder = record('transition_jira_issue');
//  before(recorder.before);
//
//  // Run the tests
//  after(recorder.after);
//});
