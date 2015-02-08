/*
 * grunt-jira-actions
 * https://github.com/jwtd/grunt-jira-actions
 *
 * Copyright (c) 2015 Jordan Duggan
 * Licensed under the MIT license.
 */

// node-jira docs can be found at:
// http://jiraplanner.com/node_modules/jira/docs/jira.html

'use strict';

var request = require('request'),
    q = require('q'),
    JiraApi = require('jira').JiraApi;
var util = require('util');

module.exports = function(grunt) {

  // Make sure Jira credentials have been set in ENV
  if (!process.env.JIRA_UN){
    grunt.fail.fatal('JIRA_UN environment variable not found. JIRA_UN and JIRA_PW must be set or JIRA calls will fail.');
  }
  if (!process.env.JIRA_PW){
    grunt.fail.fatal('JIRA_PW environment variable not found. JIRA_UN and JIRA_PW must be set or JIRA calls will fail.');
  }


  // Add or update existing properties on obj1 with values from obj2
  function _mergeRecursive(obj1, obj2) {

    //iterate over all the properties in the object which is being consumed
    for (var p in obj2) {
      // Property in destination object set; update its value.
      if ( obj2.hasOwnProperty(p) && typeof obj1[p] !== "undefined" ) {
        _mergeRecursive(obj1[p], obj2[p]);
      } else {
        //We don't have that level in the hierarchy so add it
        obj1[p] = obj2[p];
      }
    }
  }


  // Create a Jira issue
  grunt.registerMultiTask('createJiraIssue', 'Create an issue in JIRA', function() {

    // Prepare promise chain for API calls (which are asynchronous)
    var done = this.async();

    // Setup default options
    var default_options = {
      jira_host: null,
      jira_protocol: 'https',
      jira_port: 443,
      jira_api_version: '2',
      issue_type: 'Story',   // 7 = Story
      issue_state: 1,        // 1 = Open, 2 = Closed
      optional_fields: null
    };
    var options = this.options(default_options);

    // Connect to Jira
    var jira = new JiraApi(options.jira_protocol, options.jira_host, options.jira_port, process.env.JIRA_UN, process.env.JIRA_PW, options.jira_api_version);

    // Chainable method that creates an issue
    function createJiraIssue() {
      var deferred = q.defer();
      grunt.log.writeln('Create Jira issue');

      // If the description is a file path, import it as though it
      var description = options.description;
      if (grunt.file.exists(description)) {
        var ext = description.split('.').pop().toLowerCase();
        if (ext === 'json') {
          description = grunt.file.readJSON(description);
        } else {
          description = grunt.file.read(description);
        }
      }

      // json that Jira API is expecting
      var issue_json = {
        'fields': {
          'project': {
            'id': options.project_id
          },
          'issuetype': {
            'name': options.issue_type
          },
          'summary': options.summary,
          'description': description
        }
      };

      // Add any other options passed in to the JSON
      if (options.optional_fields != null){
        _mergeRecursive(issue_json.fields, options.optional_fields)
      }
      grunt.verbose.writeln('Create issue json:\n' + util.inspect(issue_json, {showHidden: false, depth: null}));

      jira.addNewIssue(issue_json, function(error, response){
        if (error) {
          deferred.reject(error);
        } else {
          grunt.verbose.writeln('New issue\'s id: ' + response.id);
          deferred.resolve(response.id);
        }
      });

      return deferred.promise;
    }

    // Chainable method to transition an issue to a specific state
    function transitionJiraIssue(issue_id) {
      var deferred = q.defer();

      // If the state is anything other than Open, then transition the issue to the desired state
      if (options.issue_state > 1){
        grunt.verbose.writeln('Set issue_state to: ' + options.issue_state);

        // json that Jira API is expecting
        var transition_json = {
          'transition': {
            'id': options.issue_state
          }
        };
        grunt.verbose.writeln('Transition issue json:\n' + util.inspect(transition_json, {showHidden: false, depth: null}));

        jira.transitionIssue(issue_id, transition_json, function(error, response){
          if (error) {
            deferred.reject(error);
          } else {
            grunt.verbose.writeln('Transition request ' + response);
            deferred.resolve(issue_id);
          }
        });
      }

      return deferred.promise;
    }

    // Call the create issue method and then transition it if necessary
    createJiraIssue()
      .then(function(issue_id){
        return transitionJiraIssue(issue_id);
      })
      .catch(function(error){
        grunt.log.writeln('Create issue request error: ' + util.inspect(error, {showHidden: false, depth: null}));
        grunt.fatal(error);
      })
      .done(function(){
        grunt.verbose.writeln('All updates completed.');
        done();
      });

  });



  // Comment on a Jira issue
  grunt.registerMultiTask('commentOnJiraIssue', 'Add a comment to an issue in JIRA', function() {

    var done = this.async();

    // Default options
    var options = this.options({
      jira_host: null,
      jira_protocol: 'https',
      jira_port: 443,
      jira_api_version: '2',
      comment: 'No comment'
    });

    // Connect to Jira
    var jira = new JiraApi(options.jira_protocol, options.jira_host, options.jira_port, process.env.JIRA_UN, process.env.JIRA_PW, options.jira_api_version);

    // Chainable method that adds a comment to an issue
    function addJiraComment() {
      var deferred = q.defer();
      grunt.log.writeln('Add a comment to an issue in Jira');

      // json that Jira API is expecting
      var comment_json = {
        'body': options.comment
      };

      jira.addNewComment(comment_json, function(error, response){
        if (error) {
          grunt.log.writeln('Add comment request error: ' + error);
          deferred.reject(error);
        } else {
          grunt.log.writeln('Add comment: ' + response);
          deferred.resolve(response);
        }
      });

      return deferred.promise;
    }

    // Call the transition issue method
    addJiraComment()
      .catch(function(error){
        grunt.fatal(error);
      })
      .done(function(){
        grunt.verbose.writeln('Comment addition complete.');
        done();
      });

  });


// url: options.jira_api_url + util.format('issue/%s/comment', issue_id),

};
