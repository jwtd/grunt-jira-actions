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


// addJiraComment tests
exports.group = {


  addJiraComment_fromOption_should_PASS: function(test) {

    callGrunt('addJiraComment:fromOption_should_PASS', function (error, stdout, stderr) {
      //console.log(stdout);
      //parseTestOutput(stdout);

      // Parse test output
      var blocks = splitOutput(stdout);
      var jira_api_json = JSON.parse(blocks[3]);  // Add comment json
      var response = JSON.parse(blocks[5]);       // Add comment response

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
        'This is the comment as a string.',
        'Comment should be an expected text string'
      );


      // Verify response against nocked response unless nock is off
      test.ok(
        response.self,
        'Should create an comment with a valid url as a reference'
      );

      // TODO: Search for comment and verify that its description was set correctly

      test.equal(
        stdout.indexOf('Done, without errors') > -1,
        true,
        'Should report that it was Done, without errors'
      );

      test.expect(7);
      test.done();
    });
  },



  addJiraComment_fromFileToIssue_should_PASS: function(test) {

    callGrunt('addJiraComment:fromFileToIssue_should_PASS', function (error, stdout, stderr) {
      //console.log(stdout);
      //parseTestOutput(stdout);

      // Parse test output
      var blocks = splitOutput(stdout);
      var jira_api_json = JSON.parse(blocks[3]);  // Add comment json
      var response = JSON.parse(blocks[5]);       // Add comment response

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
        grunt.file.read('test/data/comment_body.txt'),
        'Should import its description from a file'
      );

      // Verify response against nocked response unless nock is off
      test.ok(
        response.id,
        'Should create an comment with a new id'
      );

      // TODO: Search for comment and verify that its content was set correctly

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
   *  Failure cases for addJiraComment   *
   *-------------------------------------*/


  addJiraComment_withoutContent_should_FAIL: function(test) {

    callGrunt('addJiraComment:withoutContent_should_FAIL', function (error, stdout, stderr) {
      //console.log(stdout);
      //parseTestOutput(stdout);

      // Parse test output
      var blocks = splitOutput(stdout);
      var options = JSON.parse(blocks[1]);  // Add comment options

      test.equal(
        options.comment,
        null,
        'Should not have a default value for summary'
      );

      test.notEqual(
        error,
        null,
        'Should return an error'
      );

      test.equal(
        stdout.indexOf('Required option comment was null') > -1,
        true,
        'Should tell user that comment is a required option'
      );

      test.expect(3);
      test.done();
    });
  }


};
