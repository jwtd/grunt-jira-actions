"use strict";

// BDD using chai
var chai = require("chai"),
  expect = require('chai').expect,
  should = require('chai').should();

var path = require('path'),
    exec = require('child_process').exec,
    execOptions = {
      cwd: path.join(__dirname, '..')
    }

// Use nock recorder to mock API responses
var record = require('./record');
var util = require('util');

// Prepare the grunt tasks for testing
var grunt = require('grunt');


// Keep tests in seperate gruntfiles
//function callGruntfile(filename, whenDoneCallback) {
//  var command, options;
//  command = "grunt --gruntfile " + filename + " --no-color";
//  options = {cwd: 'test/'};
//  exec(command, options, whenDoneCallback);
//}


describe('createJiraIssue', function () {
  var recorder = record('createJiraIssue');
  before(recorder.before);

  // Make sure the task was loaded
  it('should register itself with Grunt', function () {
    grunt.task._tasks['createJiraIssue'].should.exist;
  });

  describe('when using the default options', function () {

    it('should merge common option defaults into task option defaults', function() {
        exec('grunt createJiraIssue:createAndCloseFooStory --TEST=true', execOptions, function(error, stdout, stderr) {
        // AssertionError: Expected command should not fail
        expect(error).to.equal(null);
        // AssertionError: Expected standard error stream should be empty
        expect(stderr).to.equal('');

        var stdoutOk = contains(stdout, 'Done, without errors.');
        // AssertionError: Expected plugin worked correctly
        expect(stdoutOk).to.equal(true); 
      });

      //it('should merge common option defaults into task option defaults', function() {
      //
      //  var o = grunt.option;
      //
      //  // Task options
      //  expect(o('issue_type')).to.equal('Story');
      //  expect(o('issue_state')).to.equal(1);
      //  expect(o('optional_fields')).to.equal(null);
      //
      //  // Common options
      //  expect(o('env_var_for_jira_username')).to.equal('JIRA_UN');
      //  expect(o('env_var_for_jira_username')).to.equal('JIRA_PW');
      //  expect(o('jira_host')).to.equal(null);
      //  expect(o('jira_port')).to.equal(443);
      //  expect(o('jira_api_version')).to.equal('2');
      //
      //});

    });

  });

  // Capture the fixture recording if it was created
  after(recorder.after);
});


//describe('Transition Jira issue', function () {
//  var recorder = record('transition_jira_issue');
//  before(recorder.before);
//  // Run the tests
//  after(recorder.after);
//});


