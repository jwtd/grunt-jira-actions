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

  createJiraIssue_runs_without_errors: function(test) {
    test.expect(1); // # of assertions that should run
    callGrunt('createJiraIssue:createAndCloseFooStory', function(error, stdout) {

      console.log(stdout);

      test.equal(
        stdout.indexOf('Done, without errors.') > -1,
        true,
        'Found done'
      );

      //test.equal(
      //  stdout.indexOf('L8') > -1,
      //  true,
      //  'too many newlines in newline blocks in file'
      //);
      //
      //test.equal(
      //  stdout.indexOf('L17') > -1,
      //  true,
      //  'too many newlines in newline blocks in file'
      //);
      //
      //test.equal(
      //  stdout.indexOf('L32') > -1,
      //  true,
      //  'toomany lines at the end of file.'
      //);
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


