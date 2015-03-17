'use strict';

// nodeunit
var util = require('util'),
    path = require('path'),
    grunt = require('grunt'),
    h = require('./helper');

var exports = module.exports;


// addJiraComment tests
exports.group = {


  addJiraComment_fromOption_should_PASS: function(test) {

    // TODO: Add or get an issue whose ID can be used for success cases (use 19935 which is GEN-359 for now)

    h.callGrunt('addJiraComment:fromOption_should_PASS:19935', function (error, stdout, stderr) {
      //console.log(stdout);
      //h.parseTestOutput(stdout);

      // Parse test output
      var blocks = h.splitOutput(stdout);
      var options = JSON.parse(blocks[1]);       // Add comment response
      var content = JSON.parse(blocks[3]);       // Add comment content
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
        content,
        'This is the comment as a string.',
        'Comment should be an expected text string'
      );

      // TODO: Search for comment and verify that its content was set correctly

      // Test the only thing different in this target
      test.equal(
        response,
        'Success',
        'Response should be "Success"'
      );

      test.equal(
        stdout.indexOf('Done, without errors') > -1,
        true,
        'Should report that it was Done, without errors'
      );

      test.expect(5);
      test.done();
    });
  },



  addJiraComment_fromFileToIssue_should_PASS: function(test) {

    h.callGrunt('addJiraComment:fromFileToIssue_should_PASS:19935', function (error, stdout, stderr) {
      //console.log(stdout);
      //h.parseTestOutput(stdout);

      // Parse test output
      var blocks = h.splitOutput(stdout);
      var options = JSON.parse(blocks[1]);  // Add comment json
      var content = JSON.parse(blocks[3]);       // Add comment content
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
        content,
        grunt.file.read('test/data/comment_body.txt'),
        'Should import its description from a file'
      );

      // TODO: Search for comment and verify that its content was set correctly

      // Test the only thing different in this target
      test.equal(
        response,
        'Success',
        'Response should be "Success"'
      );

      test.equal(
        stdout.indexOf('Done, without errors') > -1,
        true,
        'Should report that it was Done, without errors'
      );

      test.expect(5);
      test.done();
    });
  },



  /*-------------------------------------*
   *  Failure cases for addJiraComment   *
   *-------------------------------------*/


  addJiraComment_withoutContent_should_FAIL: function(test) {

    h.callGrunt('addJiraComment:withoutContent_should_FAIL', function (error, stdout, stderr) {
      //console.log(stdout);
      //h.parseTestOutput(stdout);

      // Parse test output
      var blocks = h.splitOutput(stdout);
      var options = JSON.parse(blocks[1]);  // Add comment options

      test.equal(
        options.comment,
        null,
        'Should not have a default value for comment'
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
  },


  addJiraComment_withoutPassingIssueId_should_FAIL: function(test) {

    h.callGrunt('addJiraComment:withoutPassingIssueId_should_FAIL', function (error, stdout, stderr) {
      //console.log(stdout);
      //h.parseTestOutput(stdout);

      // Parse test output
      var blocks = h.splitOutput(stdout);
      var options = JSON.parse(blocks[1]);  // Add comment options

      test.notEqual(
        error,
        null,
        'Should return an error'
      );

      test.equal(
        stdout.indexOf('404: Error while adding comment') > -1,
        true,
        'Should tell user the call resulted in a 404'
      );

      test.expect(2);
      test.done();
    });
  }


};
