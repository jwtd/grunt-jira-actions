/*
 * grunt-jira-actions
 * https://github.com/jwtd/grunt-jira-actions
 *
 * Copyright (c) 2015 Jordan Duggan
 * Licensed under the MIT license.
 */

'use strict';

var request = require('request'),
    q = require('q'),
    JiraApi = require('jira').JiraApi;

module.exports = function(grunt) {

  // Create a Jira issue
  grunt.registerMultiTask('createJiraIssue', 'Create an issue in JIRA', function() {

    var done = this.async();

    // Default options
    var options = this.options({
      jira_host: null,
      jira_protocol: 'https',
      jira_port: 443,
      jira_un: process.env.JIRA_UN,
      jira_pw: process.env.JIRA_PW,
      jira_api_version: '2',
      issue_type_id: 7, // Story
      issue_state: 1    // 1 = Open, 2 = Closed
    });

    // Connect to Jira
    var jira = new JiraApi(options.jira_protocol, options.jira_host, options.jira_port, options.jira_un, options.jira_pw, options.jira_api_version);

    // Chainable method that creates an issue
    var createJiraIssue = function() {
      var deferred = q.defer();
      grunt.log.writeln('Create Jira issue');

      // json that Jira API is expecting
      var issue_json = {
        "fields": {
          "project": {
            "id": options.project_id
          },
          "summary": options.summary,
          "description": options.description,
          "issuetype": {
            "id": options.issue_type_id
          }
        }
      };

      jira.addNewIssue(issue_json, function(error, response){
        if (error) {
          grunt.log.writeln('Create issue request error: ' + error);
          deferred.reject(error);
        } else {
          grunt.log.writeln('issue_id: ' + response.id);
          deferred.resolve(response.id);
        }
      });

      return deferred.promise;
    }

    // Chainable method to transition an issue to a sepcific state
    var transitionJiraIssue = function(issue_id) {
      var deferred = q.defer();

      // If the state is anything other than Open, then transition the issue to the desired state
      if (options.issue_state > 1){
        grunt.log.writeln('Set issue_state to: ' + options.issue_state);

        // json that Jira API is expecting
        var transition_json = {
          "transition": {
            "id": options.issue_state
          }
        }

        jira.transitionIssue(issue_id, transition_json, function(error, response){
          if (error) {
            grunt.log.writeln('Transition request error: ' + error);
            deferred.reject(error);
          } else {
            grunt.log.writeln('Transition request ' + response);
            deferred.resolve(issue_id);
          }
        });
      }

      return deferred.promise;
    }

    // Call the transition issue method
    createJiraIssue()
      .then(function(issue_id){
        return transitionJiraIssue(issue_id);
      })
      .catch(function(error){
        grunt.fatal(error);
      })
      .done(function(){
        grunt.verbose.writeln("All updates completed.");
        done();
      });

  });

// url: options.jira_api_url + util.format("issue/%s/comment", issue_id),

};
