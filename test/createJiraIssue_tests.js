'use strict';

// nodeunit
var util = require('util'),
    path = require('path'),
    grunt = require('grunt'),
    h = require('./helper');

var exports = module.exports;

// createJiraIssue tests
exports.group = {


  createJiraIssue_withMinimumOptions_should_PASS: function(test) {

    // Make sure task registers itself in grunt
    test.ok(
      grunt.task._tasks.createJiraIssue,
      'Should register itself as a grunt task'
    );

    h.callGrunt('createJiraIssue:withMinimumOptions_should_PASS', function (error, stdout, stderr) {
      //console.log(stdout);
      //h.parseTestOutput(stdout);

      // Parse test output
      var blocks = h.splitOutput(stdout);
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

    h.callGrunt('createJiraIssue:asValidStoryDescrFromOption_should_PASS', function (error, stdout, stderr) {
      //console.log(stdout);
      //h.parseTestOutput(stdout);

      // Parse test output
      var blocks = h.splitOutput(stdout);
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

      test.expect(7);
      test.done();
    });
  },



  createJiraIssue_asValidTaskDescrFromFile_should_PASS: function(test) {

    h.callGrunt('createJiraIssue:asValidTaskDescrFromFile_should_PASS', function (error, stdout, stderr) {
      //console.log(stdout);
      //h.parseTestOutput(stdout);

      // Parse test output
      var blocks = h.splitOutput(stdout);
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

      test.expect(7);
      test.done();
    });
  },


  createJiraIssue_asValidStoryMarkedDone_should_PASS: function(test) {

    h.callGrunt('createJiraIssue:asValidStoryMarkedDone_should_PASS', function (error, stdout, stderr) {
      //console.log(stdout);
      //h.parseTestOutput(stdout);

      // Parse test output
      var blocks = h.splitOutput(stdout);
      var jira_api_json = JSON.parse(blocks[9]);  // Transition json
      var response = JSON.parse(blocks[11]);      // Transition response
      //var jira_api_json = JSON.parse(blocks[3]);  // Transition json
      //var response = JSON.parse(blocks[5]);      // Transition response

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

      test.expect(5);
      test.done();
    });
  },


  createJiraIssue_asValidStoryWithPriority_should_PASS: function(test) {

    h.callGrunt('createJiraIssue:asValidStoryWithPriority_should_PASS', function (error, stdout, stderr) {
      //console.log(stdout);
      //h.parseTestOutput(stdout);

      // Parse test output
      var blocks = h.splitOutput(stdout);
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
        jira_api_json.fields.priority.name,
        'Major',
        'Should be able to set the priority of new issues'
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

      // TODO: Search for issue and verify that its priority was set correctly

      test.equal(
        stdout.indexOf('Done, without errors') > -1,
        true,
        'Should report that it was Done, without errors'
      );

      test.expect(7);
      test.done();
    });
  },


  /*-------------------------------------*
  *  Failure cases for createJiraIssue  *
  *-------------------------------------*/


  createJiraIssue_withoutRequiredOptions_should_FAIL: function(test) {

    h.callGrunt('createJiraIssue:withoutRequiredOptions_should_FAIL', function (error, stdout, stderr) {
      //console.log(stdout);
      //h.parseTestOutput(stdout);

      // Parse test output
      var blocks = h.splitOutput(stdout);
      var options = JSON.parse(blocks[1]);  // Create issue options

      test.equal(
        options.summary,
        null,
        'Should not have a default value for summary'
      );

      test.notEqual(
        error,
        null,
        'Should return an error'
      );

      test.equal(
        stdout.indexOf('Required option summary was null') > -1,
        true,
        'Should tell user that summary is a required option'
      );

      test.expect(3);
      test.done();
    });
  },


  createJiraIssue_withInvalidIssueType_should_FAIL: function(test) {

    h.callGrunt('createJiraIssue:withInvalidIssueType_should_FAIL', function (error, stdout, stderr) {
      //console.log(stdout);
      //h.parseTestOutput(stdout);

      // Parse test output
      var blocks = h.splitOutput(stdout);
      var error = JSON.parse(blocks[5]);  // Create issue options

      test.notEqual(
        error,
        null,
        'Should return an error'
      );

      test.equal(
        stdout.indexOf('issue type is required') > -1,
        true,
        'Should tell user that issue type is a required option'
      );

      test.expect(2);
      test.done();
    });
  },


  createJiraIssue_withInvalidIssueState_should_FAIL: function(test) {

    h.callGrunt('createJiraIssue:withInvalidIssueState_should_FAIL', function (error, stdout, stderr) {
      //console.log(stdout);
      //h.parseTestOutput(stdout);

      // Parse test output
      var blocks = h.splitOutput(stdout);
      var error = JSON.parse(blocks[11]);  // Create issue options

      test.notEqual(
        error,
        null,
        'Should return an error'
      );

      test.equal(
        stdout.indexOf('Transition issue error') > -1,
        true,
        'Should tell user that there was a transition issue error'
      );

      test.expect(2);
      test.done();
    });
  },


  createJiraIssue_withInvalidPriority_should_FAIL: function(test) {

    h.callGrunt('createJiraIssue:withInvalidPriority_should_FAIL', function (error, stdout, stderr) {
      //console.log(stdout);
      //h.parseTestOutput(stdout);

      // Parse test output
      var blocks = h.splitOutput(stdout);
      var error = JSON.parse(blocks[5]);  // Create issue options

      test.notEqual(
        error,
        null,
        'Should return an error'
      );

      test.equal(
        stdout.indexOf('Fatal error: Priority name \'BLARG\' is not valid') > -1,
        true,
        'Should tell user that the priority was invalid'
      );

      test.expect(2);
      test.done();
    });
  }


};
