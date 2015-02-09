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

var util = require('util'),
    q = require('q'),
    JiraApi = require('jira').JiraApi;

module.exports = function(grunt) {


  // Options common to all targets
  var common_options = {
    env_var_for_jira_username: 'JIRA_UN',
    env_var_for_jira_password: 'JIRA_PW',
    jira_host: null,
    jira_protocol: 'https',
    jira_port: 443,
    jira_api_version: '2'
  };


  // Make sure Jira credentials have been set in ENV
  function _validate_env_vars(env_un, env_pw) {
    if (!process.env[env_un]) {
      grunt.fail.fatal('Environment variable not found. ENV[' + env_un + '] must be set or JIRA calls will fail.');
    }
    if (!process.env[env_pw]) {
      grunt.fail.fatal('Environment variable not found. ENV[' + env_pw + '] must be set or JIRA calls will fail.');
    }
  }


  // Add or update existing properties on obj1 with values from obj2
  function _mergeRecursive(obj1, obj2) {
    // Iterate over all the properties in the object which is being consumed
    for (var p in obj2) {
      // Property in destination object set; update its value.
      if ( obj2.hasOwnProperty(p) && typeof obj1[p] !== 'undefined' ) {
        _mergeRecursive(obj1[p], obj2[p]);
      } else {
        // We don't have that level in the hierarchy so add it
        obj1[p] = obj2[p];
      }
    }
  }


  // When verbose is enabled, display the object's structure
  function _verbose_inspect(msg, obj) {
    grunt.verbose.writeln(msg + ' ' + util.inspect(obj, {showHidden: false, depth: null}));
  }


  // Create a Jira issue
  grunt.registerMultiTask('createJiraIssue', 'Create an issue in JIRA', function() {

    // Prepare promise chain for API calls (which are asynchronous)
    var done = this.async();

    // Setup task specific default options
    var default_options = {
      issue_type: 'Story',   // Story, Epic, Task, Technical Task, Sub-Task, Bug, Improvement, New Feature
      issue_state: 1,        // 1 = Open, 2 = Closed
      optional_fields: null  // JSON that should be merged into the request
    };

    // Extend default task specific options with default common options
    _mergeRecursive(default_options, common_options);

    // Overwrite default values with values specified in the target
    var options = this.options(default_options);
    _verbose_inspect('Create issue options: ', options);

    // Make sure Jira creds are set
    _validate_env_vars(options.env_var_for_jira_username, options.env_var_for_jira_password);

    // Connect to Jira
    var jira = new JiraApi(
      options.jira_protocol,
      options.jira_host,
      options.jira_port,
      process.env[options.env_var_for_jira_username],
      process.env[options.env_var_for_jira_password],
      options.jira_api_version);

    // Chainable method that creates an issue
    function createJiraIssue() {
      var deferred = q.defer();
      grunt.log.writeln('Create Jira issue');

      // If the description is a file path, use its contents as the description
      var description = options.description;
      if (grunt.file.exists(description)) {
        var ext = description.split('.').pop().toLowerCase();
        grunt.verbose.writeln('Setting issue description to be contents of ' + ext + ' file ' + description);
        description = (ext === 'json') ? grunt.file.readJSON(description) : grunt.file.read(description);
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
        _mergeRecursive(issue_json.fields, options.optional_fields);
      }
      _verbose_inspect('Create issue json: ', issue_json);

      // Call Jira REST API using node-jira
      jira.addNewIssue(issue_json, function(error, response){
        if (error) {
          deferred.reject(error);
        } else {
          _verbose_inspect('Create issue response: ', response);
          grunt.log.writeln('New issue: ' + response.key + '(' + response.id + ')');
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
        _verbose_inspect('Transition issue json: ', transition_json);

        jira.transitionIssue(issue_id, transition_json, function(error, response){
          if (error) {
            deferred.reject(error);
          } else {
            _verbose_inspect('Transition response: ', response);
            deferred.resolve(issue_id);
          }
        });
      }

      return deferred.promise;
    }

    // Call the create issue method and then transition it if necessary
    createJiraIssue()
      .then(function(issue_id){
        grunt.config('jira.last_issue_id', issue_id);
        return transitionJiraIssue(issue_id);
      })
      .catch(function(error){
        _verbose_inspect('Create issue error: ', error);
        grunt.fatal(error);
      })
      .done(function(){
        grunt.log.writeln('Create issue completed');
        done();
      });

  });



  // Comment on a Jira issue
  grunt.registerMultiTask('addJiraComment', 'Add a comment to an issue in JIRA', function(issue_id) {

    var done = this.async();

    // Setup task specific default options
    var default_options = {
      issue_id: issue_id || grunt.config('jira.last_issue_id'),
      comment: 'Comment body was not specified'
    };

    // Extend default task specific options with default common options
    _mergeRecursive(default_options, common_options);

    // Overwrite default values with values specified in the target
    var options = this.options(default_options);
    _verbose_inspect('Add comment options: ', options);

    // Make sure Jira creds are set
    _validate_env_vars(options.env_var_for_jira_username, options.env_var_for_jira_password);

    // Connect to Jira
    var jira = new JiraApi(
      options.jira_protocol,
      options.jira_host,
      options.jira_port,
      process.env[options.env_var_for_jira_username],
      process.env[options.env_var_for_jira_password],
      options.jira_api_version);

    // If the comment is a file path, use its contents as the comment
    var comment = options.comment;
    if (grunt.file.exists(comment)) {
      var ext = comment.split('.').pop().toLowerCase();
      grunt.verbose.writeln('Comment text will be contents of ' + ext + ' file ' + comment);
      comment = (ext === 'json') ? grunt.file.readJSON(comment) : grunt.file.read(comment);
    }

    // Chainable method that adds a comment to an issue
    function addJiraComment() {
      var deferred = q.defer();
      grunt.log.writeln('Add a comment to an issue in Jira');

      // Pass comment directly to node-jira (instead of json)
      jira.addComment(issue_id, comment, function(error, response){
        if (error) {
          deferred.reject(error);
        } else {
          deferred.resolve(response);
        }
      });

      return deferred.promise;
    }

    // Call the transition issue method
    addJiraComment()
      .then(function(response){
        _verbose_inspect('Add comment response: ', response);
      })
      .catch(function(error){
        _verbose_inspect('Add comment error: ', error);
        grunt.fatal(error);
      })
      .done(function(){
        grunt.log.writeln('Add comment completed');
        done();
      });

  });

};
