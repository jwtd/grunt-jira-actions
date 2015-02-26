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



exports.tests = {
  createIssue: function(test) {
    test.expect(1);
    exec('createJiraIssue:createAndCloseFooStory', execOptions, function(error, stdout) {
      //var message = MESSAGES.NEWLINE_MAXIMUM_INVALIDVALUE.message.replace('{a}', '0');
      var message = 'Look for this value';
      test.equal(stdout.indexOf(message) > -1, true,
        'Put error message here'
      );
      test.done();
    });
  }
};


describe('createJiraIssue', function () {
  var recorder = record('createJiraIssue');
  before(recorder.before);


  // Make sure the task was loaded
  it('should register itself with Grunt', function () {
    grunt.task._tasks['createJiraIssue'].should.exist;
  });

  describe('when using the default options', function () {

    // Tell Mocha to wait for first call to complete
    this.timeout(5000);

    grunt.tasks(['createJiraIssue:createAndCloseFooStory'], {}, function() {
      grunt.log.ok('Done running createJiraIssue.');

      console.log('this.option() :: ' + util.inspect(this.option(), {showHidden: false, depth: null}));

      it('should merge common option defaults into task option defaults', function() {

        var o = grunt.option;

        // Task options
        expect(o('issue_type')).to.equal('Story');
        expect(o('issue_state')).to.equal(1);
        expect(o('optional_fields')).to.equal(null);

        // Common options
        expect(o('env_var_for_jira_username')).to.equal('JIRA_UN');
        expect(o('env_var_for_jira_username')).to.equal('JIRA_PW');
        expect(o('jira_host')).to.equal(null);
        expect(o('jira_port')).to.equal(443);
        expect(o('jira_api_version')).to.equal('2');

      });

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


