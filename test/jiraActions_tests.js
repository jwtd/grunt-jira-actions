'use strict';

// nodeunit
var util = require('util'),
    path = require('path'),
   grunt = require('grunt'),
    exec = require('child_process').exec;

var exports = module.exports;


// Duplicate the environment object
// NOTE: Environment variables in child processes are always strings
var envDup = [],
    envVar;
for (envVar in process.env) {
  if (process.env.hasOwnProperty(envVar)) {
    envDup[envVar] = process.env[envVar];
  }
}

// Record new http mocks
envDup.NOCK_RECORD = true;

// Prepare configuration for exec calls
var execOptions = {
  cwd: path.join(__dirname, '..'),  // Run in tests directory
  env: envDup                       // Pass in the duplicated env variables
  //encoding: 'utf8',
  //timeout: 0,            // kill child process if it runs longer than timeout milliseconds
  //maxBuffer: 200*1024,   // kill child process if data in stdout or stderr exceeds this limit
  //killSignal: 'SIGTERM'  // The child process is killed with killSignal (default: 'SIGTERM')
};


// Call grunt with the correct flags
function callGrunt(task, whenDoneCallback) {
  exec('grunt ' + task + ' --env=TEST --no-color', execOptions, whenDoneCallback);
}


// createJiraIssue tests
exports.group = {


  createJiraIssue_withMinimumOptions_should_PASS: function(test) {
    test.expect(11); // # of assertions that should run

    // Registers itself as a task
    test.ok(
      grunt.task._tasks.createJiraIssue,
      'Registers itself as a grunt task'
    );


/*
 createJiraIssue:withMinimumOptions_should_PASS
 *** Create issue options ***
 { issue_type: 'Story',
 issue_state: 1,
 project_id: 10400,
 summary: 'Issue from project_id, jira_host, summary, and defaults for everything else',
 description: null,
 additional_fields: null,
 env_var_for_jira_username: 'JIRA_UN',
 env_var_for_jira_password: 'JIRA_PW',
 jira_protocol: 'https',
 jira_host: 'virtru.atlassian.net',
 jira_port: 443,
 jira_api_version: '2' }
 *** Create issue json ***
 { fields:
 { project: { id: 10400 },
 issuetype: { name: 'Story' },
 summary: 'Issue from project_id, jira_host, summary, and defaults for everything else' } }
 *** Create issue response ***
 { id: '19850',
 key: 'GEN-281',
 self: 'https://virtru.atlassian.net/rest/api/2/issue/19850' }
 Issue created (id = 19850) GEN-281 : Issue from project_id, jira_host, summary, and defaults for everything else
 Create issue completed
*/
    callGrunt('createJiraIssue:withMinimumOptions_should_PASS', function(error, stdout, stderr) {
      console.log(stdout);

      // Make sure there were no errors
      test.equal(
        stderr,
        '',
        'Standard error stream should be empty'
      );
      test.equal(
        error,
        null,
        'Should not fail.'
      );
      test.equal(
        stdout.indexOf('Done, without errors') > -1,
        true,
        'Should report that it was Done, without errors'
      );

      // Should merge common option defaults into task option defaults
      var i, defaults = [
        "issue_type: 'Story'",
        "issue_state: 1",
        "env_var_for_jira_username: 'JIRA_UN'",
        "env_var_for_jira_password: 'JIRA_PW'",
        "jira_protocol: 'https'",
        "jira_port: 443",
        "jira_api_version: '2'"
      ];
      for (i in defaults) {
        if (defaults.hasOwnProperty(i)) {
          test.equal(stdout.indexOf(defaults[i]) > -1, true, 'Target options should have default: ' + defaults[i]);
        }
      }

      test.equal(
        stdout.indexOf('project: { id: 10400 }') > -1,
        true,
        'node-jira json should be valid'
      );
      test.equal(
        stdout.indexOf('project: { id: 10400 }') > -1,
        true,
        'node-jira json should be valid'
      );
      test.equal(
        stdout.indexOf('project: { id: 10400 }') > -1,
        true,
        'node-jira json should be valid'
      );

      /*
      { fields:
      { project: { id: 10400 },
        issuetype: { name: 'Story' },
        summary: 'Issue from project_id, jira_host, summary, and defaults for everything else',
          description: undefined } }
      */

      test.done();
    });
  }

};
