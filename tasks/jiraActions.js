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

  grunt.registerMultiTask('createJiraIssue', 'Create a issue in JIRA', function() {

    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      jira: {
        api_url: null,
        proxy : null,
        user: process.env.JIRA_UN,
        password: process.env.JIRA_PW
      },
      project: {
        id: null,
        name: null,
        version: null,
        build_label: null
      },
      issue: {
        type_id: 7, // Story
        state: 1,    // 1 = Open, 11 = Done
        summary: null,
        description: null,
        components: 'ACM'
      }
    });
    grunt.verbose.writeflags(options);

    var createIssue = function(){
      grunt.verbose.writeln("Creating issue");

      var deferred = q.defer();
      //https://developer.atlassian.com/display/JIRADEV/JIRA+REST+API+Example+-+Create+Issue
      var issue_json = {
        "fields": {
          "project":
          {
            "id": options.project.id
          },
          "summary": options.issue.summary,
          "description": options.issue.description,
          "components": options.issue.components,
          "issuetype": {
            "id": options.issue.type_id
          }
        }
      };

      grunt.verbose.writeln(JSON.stringify(issue_json));

      request({
        url: options.jira.api_url + "issue/",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent" : "Node Request"
        },
        method: 'POST',
        auth: {
          user: options.jira.user,
          pass: options.jira.password
        },
        proxy: options.jira.proxy,
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


    // Update the status of an issue
    var transitionIssueToState = function(issue_id){
      grunt.verbose.writeln("Updating issue to 'Done' state");

      var deferred = q.defer();

      request({
        url: options.jira.api_url + util.format("issue/%s/transitions", issue_id),
        headers: {
          "Content-Type": "application/json",
          "User-Agent" : "Node Request"
        },
        method: 'POST',
        auth: {
          user: options.jira.user,
          pass: options.jira.password
        },
        proxy: options.jira.proxy,
        json: {
          "transition":
          {
            "id": options.issue.state
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
    createIssue()
      .then(function(issue_id){
        return transitionIssueToState();
      })
      .catch(function(error){
        grunt.fatal(error);
      })
      .done(function(){
        grunt.log.writeln("Issue created and marked as done.");
        done();
      });

  });

};
