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
envDup.env = 'TEST';

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

function parseTestOutput(s){
  var n;
  var blocks = s.split('||||');
  for (n in blocks) {
    if (blocks.hasOwnProperty(n)) {
      console.log('** ' + n + ' **\n' + blocks[n]);
    }
  }
  //console.log('Inspect Object :: ' + util.inspect(blocks, {showHidden: false, depth: null}));
}

// Call grunt with the correct flags
function splitOutput(s) {
  return s.split('||||');
}


// createJiraIssue tests
exports.group = {


  createJiraIssue_withMinimumOptions_should_PASS: function(test) {

    // Make sure task registers itself in grunt
    test.ok(
      grunt.task._tasks.createJiraIssue,
      'SHould register itself as a grunt task'
    );

    callGrunt('createJiraIssue:withMinimumOptions_should_PASS', function (error, stdout, stderr) {
      //console.log(stdout);
      //parseTestOutput(stdout);

      // Parse test output
      var blocks = splitOutput(stdout);
      var target_options = JSON.parse(blocks[1]); // Create issue options
      var jira_api_json = JSON.parse(blocks[3]);  // Create issue json
      var response = JSON.parse(blocks[5]);       // Create issue response

      // Make sure there were no errors
      test.equal(
        stderr,
        '',
        'Should have an empty standard error stream'
      );
      test.equal(
        error,
        null,
        'Should not throw an error'
      );

      // Should have required fields
      var opt;
      var required = [
        'project_id',
        'summary',
        'jira_host'
      ];
      for (opt in required) {
        if (required.hasOwnProperty(opt)) {
          test.ok(
            target_options[required[opt]],
            'Should have required option ' + required[opt]
          );
        }
      }


      /*
       Should merge common option defaults into task option defaults

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
       */
      var defaults = {
        'issue_type': 'Story',
        'issue_state': '1',
        'env_var_for_jira_username': 'JIRA_UN',
        'env_var_for_jira_password': 'JIRA_PW',
        'jira_protocol': 'https',
        'jira_port': 443,
        'jira_api_version': '2'
      };
      for (opt in defaults) {
        if (defaults.hasOwnProperty(opt)) {
          test.equal(
            target_options[opt],
            defaults[opt],
            'Should have option ' + opt + ' = ' + defaults[opt]
          );
        }
      }


      /*
       Verify api_json

       { fields:
       { project: { id: 10400 },
       issuetype: { name: 'Story' },
       summary: 'Issue from project_id, jira_host, summary, and defaults for everything else',
       description: undefined } }
       */
      test.equal(
        jira_api_json.fields.project.id,
        10400,
        'project should be 10400'
      );

      test.equal(
        jira_api_json.fields.issuetype.name,
        'Story',
        'issuetype should be Story'
      );

      test.equal(
        jira_api_json.fields.summary,
        'Issue from project_id, jira_host, summary, and defaults for everything else',
        'Summary should be an expected text string'
      );


      /*
       Verify response against nocked response unless nock is off

       { id: '19854',
       key: 'GEN-285',
       self: 'https://virtru.atlassian.net/rest/api/2/issue/19854' }
       */
      test.ok(
        response.id,
        'Should create an issue with a new id'
      );

      test.ok(
        response.key,
        'Should create an issue with a valid key'
      );

      test.ok(
        response.self,
        'Should create an issue with a valid url as a reference'
      );

      test.equal(
        stdout.indexOf('Done, without errors') > -1,
        true,
        'Should report that it was Done, without errors'
      );

      test.expect(20);
      test.done();
    });
  },



  createJiraIssue_asValidStoryDescrFromOption_should_PASS: function(test) {

    // Make sure task registers itself in grunt
    test.ok(
      grunt.task._tasks.createJiraIssue,
      'SHould register itself as a grunt task'
    );

    callGrunt('createJiraIssue:asValidStoryDescrFromOption_should_PASS', function (error, stdout, stderr) {
      //console.log(stdout);
      //parseTestOutput(stdout);

      // Parse test output
      var blocks = splitOutput(stdout);
      var jira_api_json = JSON.parse(blocks[3]);  // Create issue json
      var response = JSON.parse(blocks[5]);       // Create issue response

      // Make sure there were no errors
      test.equal(
        stderr,
        '',
        'Should have an empty standard error stream'
      );
      test.equal(
        error,
        null,
        'Should not throw an error'
      );

      // Test the only thing different in this target
      test.equal(
        jira_api_json.fields.description,
        'This is the story description as string.',
        'Description should be an expected text string'
      );


      /*
       Verify response against nocked response unless nock is off

       {"id":"19884",
       "key":"GEN-308",
       "self":"https://virtru.atlassian.net/rest/api/2/issue/19884"}
       */
      test.ok(
        response.id,
        'Should create an issue with a new id'
      );

      test.ok(
        response.key,
        'Should create an issue with a valid key'
      );

      test.ok(
        response.self,
        'Should create an issue with a valid url as a reference'
      );

      // TODO: Search for issue and verify that its description was set correctly

      test.equal(
        stdout.indexOf('Done, without errors') > -1,
        true,
        'Should report that it was Done, without errors'
      );

      test.expect(8);
      test.done();
    });
  },



  createJiraIssue_asValidTaskDescrFromFile_should_PASS: function(test) {

    // Make sure task registers itself in grunt
    test.ok(
      grunt.task._tasks.createJiraIssue,
      'SHould register itself as a grunt task'
    );

    callGrunt('createJiraIssue:asValidTaskDescrFromFile_should_PASS', function (error, stdout, stderr) {
      //console.log(stdout);
      //parseTestOutput(stdout);

      // Parse test output
      var blocks = splitOutput(stdout);
      var jira_api_json = JSON.parse(blocks[3]);  // Create issue json
      var response = JSON.parse(blocks[5]);       // Create issue response

      // Make sure there were no errors
      test.equal(
        stderr,
        '',
        'Should have an empty standard error stream'
      );
      test.equal(
        error,
        null,
        'Should not throw an error'
      );


      // Test the only thing different in this target
      test.equal(
        jira_api_json.fields.description,
        grunt.file.read('test/data/issue_body.txt'),
        'Should import its description from a file'
      );

      /*
       Verify response against nocked response unless nock is off

       {"id":"19884",
       "key":"GEN-308",
       "self":"https://virtru.atlassian.net/rest/api/2/issue/19884"}
       */

      test.ok(
        response.id,
        'Should create an issue with a new id'
      );

      test.ok(
        response.key,
        'Should create an issue with a valid key'
      );

      test.ok(
        response.self,
        'Should create an issue with a valid url as a reference'
      );

      // TODO: Search for issue and verify that its description was set correctly

      test.equal(
        stdout.indexOf('Done, without errors') > -1,
        true,
        'Should report that it was Done, without errors'
      );

      test.expect(8);
      test.done();
    });
  },


  createJiraIssue_asValidStoryMarkedDone_should_PASS: function(test) {

    // Make sure task registers itself in grunt
    test.ok(
      grunt.task._tasks.createJiraIssue,
      'SHould register itself as a grunt task'
    );

    callGrunt('createJiraIssue:asValidStoryMarkedDone_should_PASS', function (error, stdout, stderr) {
      //console.log(stdout);
      //parseTestOutput(stdout);

      // Parse test output
      var blocks = splitOutput(stdout);
      var jira_api_json = JSON.parse(blocks[9]);  // Transition json
      var response = JSON.parse(blocks[11]);      // Transition response

      // Make sure there were no errors
      test.equal(
        stderr,
        '',
        'Should have an empty standard error stream'
      );
      test.equal(
        error,
        null,
        'Should not throw an error'
      );

      /*
       Verify response against nocked response unless nock is off

       {"id":"19884",
       "key":"GEN-308",
       "self":"https://virtru.atlassian.net/rest/api/2/issue/19884"}
       */
      // Test the only thing different in this target
      test.equal(
        jira_api_json.transition.id,
        '2',
        'Should transition to state 2'
      );

      test.equal(
        response,
        'Success',
        'Should return Success as the response'
      );

      // TODO: Search for issue and verify that its description was set correctly

      test.equal(
        stdout.indexOf('Done, without errors') > -1,
        true,
        'Should report that it was Done, without errors'
      );

      test.expect(6);
      test.done();
    });
  }


};
