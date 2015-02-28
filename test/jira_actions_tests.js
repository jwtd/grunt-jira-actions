"use strict";

// nodeunit
var util = require('util'),
    path = require('path'),
   grunt = require('grunt'),
  exec   = require('child_process').exec,
 exports = module.exports;

// Mock HTTP calls with nock
var record = require('./record');


// Duplicate the environment object
// NOTE: Environment variables in child processes are always strings
//var envDup,
//    envVar;
//for (envVar in process.env) {
//  envDup[envVar] = process.env[envVar];
//}

// Prepare configuration for exec calls
var execOptions = {
  cwd: path.join(__dirname, '..'),  // Run in tests directory
  //env: envDup                       // Pass in the duplicated env variables
  //encoding: 'utf8',
  //timeout: 0,            // kill child process if it runs longer than timeout milliseconds
  //maxBuffer: 200*1024,   // kill child process if data in stdout or stderr exceeds this limit
  //killSignal: 'SIGTERM'  // The child process is killed with killSignal (default: 'SIGTERM')
}


// Call grunt with the correct flags
function callGrunt(task, whenDoneCallback) {
  var command, options;
  command = 'grunt ' + task + ' --env=TEST --no-color';
  options = {cwd: 'test/'};
  exec(command, execOptions, whenDoneCallback);
}


// createJiraIssue tests
exports.group = {

  //setUp: function (callback) {
  //  this.foo = 'bar';
  //  this.recorder = record('createJiraIssue');
  //  this.recorder.before;
  //  callback();
  //},
  //tearDown: function (callback) {
  //  // clean up
  //  recorder.after
  //  callback();
  //},

  createJiraIssue_createAndCloseFooStory: function(test) {
    test.expect(11); // # of assertions that should run

    // Registers itself as a task
    test.ok(
      grunt.task._tasks['createJiraIssue'],
      'Registers itself as a grunt task'
    );

    callGrunt('createJiraIssue:createAndCloseFooStory', function(error, stdout, stderr) {
      //console.log('stdout :: ' + util.inspect(stdout, {showHidden: false, depth: null}));

      // Make sure there were no errors
      test.equal(
        stderr,
        '',
        "Standard error stream should be empty"
      );
      test.equal(
        error,
        null,
        "Should not fail."
      );
      test.equal(
        stdout.indexOf('Done, without errors') > -1,
        true,
        'Should report that it was Done, without errors'
      );

      // Should merge common option defaults into task option defaults
      var i, defaults =[
        "issue_type: 'Story'",
        "issue_state: 1",
        "env_var_for_jira_username: 'JIRA_UN'",
        "env_var_for_jira_password: 'JIRA_PW'",
        "jira_protocol: 'https'",
        "jira_port: 443",
        "jira_api_version: '2'"
      ];
      for (i in defaults) {
        test.equal( stdout.indexOf(defaults[i]) > -1, true, 'Target options should have default: ' + defaults[i]);
      }

      test.done();
    });
  }

}

//
//describe('createJiraIssue', function () {
//  var recorder = record('createJiraIssue');
//  before(recorder.before);
//
//  // Make sure the task was loaded
//  it('should register itself with Grunt', function () {
//    grunt.task._tasks['createJiraIssue'].should.exist;
//  });
//
//  describe('when using the default options', function () {
//
//    var result = exec('grunt createJiraIssue:createAndCloseFooStory --env=TEST', execOptions, function(error, stdout, stderr) {
//      console.log('stdout :: ' + util.inspect(stdout, {showHidden: false, depth: null}));
//      // AssertionError: Expected command should not fail
//      expect(error).to.equal(null);
//      // AssertionError: Expected standard error stream should be empty
//      expect(stderr).to.equal('');
//      var stdoutOk = contains(stdout, 'Done, without errors.');
//      // AssertionError: Expected plugin worked correctly
//      expect(stdoutOk).to.equal(true);
//
//      result = stdout;
//
//    });
//
//    it('should run without errors', function() {
//      console.log('result :: ' + util.inspect(result, {showHidden: false, depth: null}));
//
//      //it('should merge common option defaults into task option defaults', function() {
//      //
//      //  var o = grunt.option;
//      //
//      //  // Task options
//      //  expect(o('issue_type')).to.equal('Story');
//      //  expect(o('issue_state')).to.equal(1);
//      //  expect(o('optional_fields')).to.equal(null);
//      //
//      //  // Common options
//      //  expect(o('env_var_for_jira_username')).to.equal('JIRA_UN');
//      //  expect(o('env_var_for_jira_username')).to.equal('JIRA_PW');
//      //  expect(o('jira_host')).to.equal(null);
//      //  expect(o('jira_port')).to.equal(443);
//      //  expect(o('jira_api_version')).to.equal('2');
//      //
//      //});
//
//    });
//
//  });
//
//  // Capture the fixture recording if it was created
//  after(recorder.after);
//});


//describe('Transition Jira issue', function () {
//  var recorder = record('transition_jira_issue');
//  before(recorder.before);
//  // Run the tests
//  after(recorder.after);
//});


