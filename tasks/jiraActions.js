/*
 * grunt-jira-tasks
 * https://github.com/jwtd/grunt-jira-tasks
 *
 * Copyright (c) 2015 Jordan Duggan
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util'),
    request = require('request'),
    fs = require('fs'),
    q = require('q');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('createJiraIssue', 'Create an issue in JIRA', function() {

    grunt.log.writeln('createJiraIssue with options:\n' + util.inspect(this.options, {showHidden: false, depth: null}));

    var done = this.async();

    // Validate that the minimum required attributes are present
    //grunt.config.requires(['jira.api_url', 'project.jira_id', 'issue.type_id', 'summary', 'description']);

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      jira: {
        api_url: null
      },
      issue: {
        project_id: null,
        type_id: 7, // Story
        state: 1,    // 1 = Open, 11 = Done
        summary: null,
        description: null
      }
    });
    grunt.verbose.writeflags(options);

    var createJiraIssue = function(){
      grunt.verbose.writeln("Creating issue");

      var deferred = q.defer();

      //https://developer.atlassian.com/display/JIRADEV/JIRA+REST+API+Example+-+Create+Issue
      var issue_json = {
        "fields": {
          "project": {
            "id": options.project.jira_id
          },
          "summary": options.issue.summary,
          "description": options.issue.description,
          "issuetype": {
            "id": options.issue.type_id
          }
        }
      };

      grunt.verbose.writeln(JSON.stringify(issue_json));

      // Call the Jira API
      request({
        //url: 'https://' + options.jira.user + ':' + options.jira.password + '@' + options.jira.api_url + "issue/",
        method: 'POST',
        url: options.jira.api_url + "issue/",
        proxy: options.jira.proxy,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent" : "grunt-jira-actions task for <%= pkg.author.name %>"
        },
        auth: {
          user: (options.jira.user || process.env.JIRA_UN),
          pass: (options.jira.password || process.env.JIRA_PW)
        },
        json: issue_json
      }, function(error, response, body){
        if (error) {
          deferred.reject(error);
        }
        else if (response.statusCode >= 300 ) {
          deferred.reject(response.statusCode + " - bad response: " + JSON.stringify(response));
        }
        else {
          var issue_id = body.id;
          grunt.log.writeln('Issue ID is: ' + issue_id);
          deferred.resolve(issue_id);
        }
      });

      return deferred.promise;
    };

    // Call the create issue method and then update its state
    createJiraIssue()
      .then(function(issue_id){
        grunt.log.writeln("Issue created.");
        if (options.issue.state > 1) {
          //return transitionIssueToState();
          grunt.task.run('transitionJiraIssueToState:' + issue_id + ':' + issue.state);
        }
      })
      .catch(function(error){
        grunt.fatal(error);
      })
      .done(function(){
        grunt.log.writeln("All updates completed.");
        done();
      });
  });

  /*
   transitionJiraIssueToState allows you to convert a Jira issue to a given state,
   such as Open, In Development, Resolved, Closed, Reopened, etc
   */
  grunt.registerMultiTask('transitionJiraIssueToState', 'Transition an issue in Jira to a specific state', function() {

    grunt.log.writeln('transitionJiraIssueToState registered');

    // Update the status of an issue
    var transitionJiraIssueToState = function(issue_id, state_id){
      grunt.verbose.writeln("Updating issue to state " + options.issue.state);

      state_id = options.issue.state;

      var deferred = q.defer();

      request({
        method: 'POST',
        url: options.jira.api_url + util.format("issue/%s/transitions", issue_id),
        proxy: options.jira.proxy,
        headers: {
          "Content-Type": "application/json",
          "User-Agent" : "Node Request"
        },
        auth: {
          user: (options.jira.user || process.env.JIRA_UN),
          pass: (options.jira.password || process.env.JIRA_PW)
        },
        json: {
          "transition":
          {
            "id": state_id
          }
        }
      }, function(error, response, body){
        if (error) {
          deferred.reject(error);
        }
        else if (response.statusCode >= 300 ) {
          deferred.reject(response.statusCode + " - bad response: " + JSON.stringify(response));
        }
        else {
          deferred.resolve(story_id);
        }
      });

      return deferred.promise;
    };

    // Call the create issue method and then update its state
    return transitionJiraIssueToState(issue_id, state_id)
      .catch(function(error){
        grunt.fatal(error);
      })
      .done(function(){
        grunt.log.writeln("Issue transitioned to state " + state_id);
        done();
      });

  });

};
