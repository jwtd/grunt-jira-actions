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


  // Build a fresh version of the Jira global config each time in case overrides were used in a previous task
  var commonOptions = function(grunt) {
    return {
      env_var_for_jira_username: grunt.config('env_var_for_jira_username') || 'JIRA_UN',
      env_var_for_jira_password: grunt.config('env_var_for_jira_password') || 'JIRA_PW',
      jira_protocol: grunt.config('jira_protocol') || 'https',
      jira_host: grunt.config('jira_host') || null,
      jira_port: grunt.config('jira_port') || 443,
      jira_api_version: grunt.config('jira_api_version') || '2'
    };
  }


  // Make sure Jira credentials have been set in ENV
  var jiraCnn = function(opt) {
    // Make sure Jira creds are set
    validateEnvVars(opt.env_var_for_jira_username, opt.env_var_for_jira_password);

    // If a jira host is specified return a connection. If it wasn't, use the cached Jira connection if one exists.
    var jira;
    if (opt.jira_host == null && grunt.config('last_jira_connection')) {
      jira = grunt.config('last_jira_connection');
    } else if (opt.jira_host != null) {
      jira = new JiraApi(
        opt.jira_protocol,
        opt.jira_host,
        opt.jira_port,
        process.env[opt.env_var_for_jira_username],
        process.env[opt.env_var_for_jira_password],
        opt.jira_api_version);
    } else {
      grunt.fatal('jira_host was not specified');
    }

    // Cache the connection in config and return connection object
    grunt.config('last_jira_connection', jira);
    return jira;
  }


  // Make sure Jira credentials have been set in ENV
  var validateEnvVars = function(env_un, env_pw) {
    if (!process.env[env_un]) {
      grunt.fail.fatal('Environment variable not found. ENV[' + env_un + '] must be set or JIRA calls will fail.');
    }
    if (!process.env[env_pw]) {
      grunt.fail.fatal('Environment variable not found. ENV[' + env_pw + '] must be set or JIRA calls will fail.');
    }
  }


  // Add or update existing properties on obj1 with values from obj2
  var recursiveMerge = function(obj1, obj2) {
    // Iterate over all the properties in the object which is being consumed
    for (var p in obj2) {
      // Property in destination object set; update its value.
      if ( obj2.hasOwnProperty(p) && typeof obj1[p] !== 'undefined' ) {
        recursiveMerge(obj1[p], obj2[p]);
      } else {
        // We don't have that level in the hierarchy so add it
        obj1[p] = obj2[p];
      }
    }
  }


  // When verbose is enabled, display the object's structure
  var verboseInspect = function(msg, obj) {
    grunt.verbose.writeln(msg + ' ' + util.inspect(obj, {showHidden: false, depth: null}));
  }


  // If a string reference is a valid file path, use its contents as the string, otherwise return the string
  var resolveContent = function(ref) {
    var content = ref;
    if (grunt.file.exists(ref)) {
      var ext = ref.split('.').pop().toLowerCase();
      grunt.verbose.writeln('Extracting description from contents of ' + ext + ' file ' + ref);
      if (ext === 'json') {
        content = grunt.file.readJSON(ref);
      } else {
        content = grunt.file.read(ref);
      }
    }
    return content;
  }


  // Setup global Jira configuration
  grunt.registerTask('setJiraConfig', 'Set common JIRA configuration to be used as defaults for all Jira Action tasks and targets', function() {

    // Overwrite default values with values specified in the target
    var options = this.options(commonOptions());
    verboseInspect('setJiraConfig options: ', options);

    // Make sure Jira creds are set
    validateEnvVars(options.env_var_for_jira_username, options.env_var_for_jira_password);

    // Save Jira options as global config
    grunt.config('env_var_for_jira_username', options.env_var_for_jira_username);
    grunt.config('env_var_for_jira_password', options.env_var_for_jira_password);
    grunt.config('jira_protocol', options.jira_protocol);
    grunt.config('jira_host', options.jira_host);
    grunt.config('jira_port', options.jira_port);
    grunt.config('jira_api_version', options.jira_api_version);

  });



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
    recursiveMerge(default_options, commonOptions());

    // Overwrite default values with values specified in the target
    var options = this.options(default_options);
    verboseInspect('Create issue options: ', options);

    // Get a Jira connection
    var jira = jiraCnn(options);

    // Chainable method that creates an issue
    function createJiraIssue() {
      var deferred = q.defer();

      // If the description is a file path, use its contents as the description
      var description = resolveContent(options.description);

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
        recursiveMerge(issue_json.fields, options.optional_fields);
      }
      verboseInspect('Create issue json: ', issue_json);

      // Call Jira REST API using node-jira
      jira.addNewIssue(issue_json, function(error, response){
        if (error) {
          deferred.reject(error);
        } else {
          verboseInspect('Create issue response: ', response);
          grunt.log.writeln('Issue created (id = ' + response.id + ') ' + response.key + ' : ' + options.summary);
          deferred.resolve(response.id);
        }
      });

      return deferred.promise;
    }

    // Call the create issue method and then transition it if necessary
    createJiraIssue()
      .then(function(issue_id){
        grunt.config('jira.last_issue_id', issue_id);
        if (options.issue_state > 1) {
          grunt.task.run('transitionJiraIssue:' + issue_id + ':' + options.issue_state);
        }
      })
      .catch(function(error){
        verboseInspect('Create issue error: ', error);
        grunt.fatal(error);
      })
      .done(function(){
        grunt.verbose.writeln('Create issue completed');
        done();
      });

  });



  // Transition a Jira issue
  grunt.registerTask('transitionJiraIssue', 'Transition an issue in JIRA', function(issue_id, issue_state) {

    // Prepare promise chain for API calls (which are asynchronous)
    var done = this.async();

    // Setup task specific default options
    var default_options = {
      issue_id: issue_id || grunt.config('jira.last_issue_id'),
      issue_state: issue_state  // 1 = Open, 2 = Closed
    };

    // Extend default task specific options with default common options
    recursiveMerge(default_options, commonOptions());

    // Overwrite default values with values specified in the target
    var options = this.options(default_options);
    verboseInspect('Transition issue options: ', options);

    // Get a Jira connection
    var jira = jiraCnn(options);

    // Chainable method to transition an issue to a specific state
    function transitionJiraIssue() {
      var deferred = q.defer();

      grunt.verbose.writeln('Set issue_state to: ' + options.issue_state);

      // json that Jira API is expecting
      var transition_json = {
        'transition': {
          'id': options.issue_state
        }
      };
      verboseInspect('Transition issue json: ', transition_json);

      jira.transitionIssue(options.issue_id, transition_json, function(error, response){
        if (error) {
          deferred.reject(error);
        } else {
          deferred.resolve(options.issue_id);
        }
      });

      return deferred.promise;
    }

    // Call the transition issue method and then transition it if necessary
    transitionJiraIssue()
      .then(function(response){
        verboseInspect('Transition response: ', response);
      })
      .catch(function(error){
        verboseInspect('Transition issue error: ', error);
        grunt.fatal(error);
      })
      .done(function(){
        grunt.log.writeln('Transition issue completed');
        done();
      });

  });


  /*
  Link a Jira issue
  linkJiraIssues:<from_issue_key>:<to_issue_key>:<link_type>:<comment>
  */
  grunt.registerTask('linkJiraIssue', 'Link two Jira issues', function(from_issue_key, to_issue_key, link_type, comment) {

    // Prepare promise chain for API calls (which are asynchronous)
    var done = this.async();

    // Setup task specific default options
    var default_options = {
      from_issue_key: from_issue_key,
      to_issue_key: to_issue_key,
      link_type: link_type || 'Relates', // Blocks, Cloners, Duplicate, Relates
      comment: comment
    };

    // Extend default task specific options with default common options
    recursiveMerge(default_options, commonOptions());

    // Overwrite default values with values specified in the target
    var options = this.options(default_options);
    verboseInspect('Link issue options: ', options);

    // Get a Jira connection
    var jira = jiraCnn(options);

    // Chainable method to link an issue to a specific state
    function linkJiraIssues() {
      var deferred = q.defer();

      // If the comment is a file path, use its contents as the comment
      var c = resolveContent(options.comment);

      // json that Jira API is expecting
      var link_json = {
        'linkType': options.link_type, // 'Duplicate'
        'fromIssueKey': options.from_issue_key,
        'toIssueKey': options.to_issue_key,
        'comment': {
          'body': c //,
          //'visibility': {
          //  'type': 'GROUP',
          //  'value': 'jira-users'
          //}
        }
      };
      verboseInspect('Link issue json: ', link_json);

      jira.issueLink(link_json, function(error, response){
        if (error) {
          deferred.reject(error);
        } else {
          deferred.resolve(options.from_issue_key);
        }
      });

      return deferred.promise;
    }

    // Call the transition issue method and then transition it if necessary
    linkJiraIssues()
      .then(function(response){
        verboseInspect('Link issues response: ', response);
      })
      .catch(function(error){
        verboseInspect('Link issues error: ', error);
        grunt.fatal(error);
      })
      .done(function(){
        grunt.log.writeln('Link issues completed');
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
    recursiveMerge(default_options, commonOptions());

    // Overwrite default values with values specified in the target
    var options = this.options(default_options);
    verboseInspect('Add comment options: ', options);

    // Get a Jira connection
    var jira = jiraCnn(options);

    // If the comment is a file path, use its contents as the comment
    var comment = resolveContent(options.comment);

    // Chainable method that adds a comment to an issue
    function addJiraComment() {
      var deferred = q.defer();

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
        verboseInspect('Add comment response: ', response);
      })
      .catch(function(error){
        verboseInspect('Add comment error: ', error);
        grunt.fatal(error);
      })
      .done(function(){
        grunt.log.writeln('Add comment completed');
        done();
      });

  });


  /*
   Create a version
   createJiraVersion:project_key:version_name:release_date_string
   */
  grunt.registerMultiTask('createJiraVersion', 'Create a new version for a project in JIRA', function(project_key, version_name, release_date_string) {

    var done = this.async();

    // If a release date isn't specified, use the current date. Format the date as "2010-07-05".
    var release_date;
    if (release_date_string) {
      release_date = grunt.template(release_date_string, 'yyyy-mm-dd');
    } else {
      release_date = grunt.template.today('yyyy-mm-dd');
    }

    // Setup task specific default options
    var default_options = {
      project_key: project_key || null,  // "GEN"
      name: version_name,                // "New Version 1"
      description: version_name,         // "New Version 1 is going to be foo"
      archived: false,
      released: true,
      start_date: null,
      release_date: release_date // "2010-07-05"
      //userReleaseDate: "5/Jul/2010"
    };

    // Extend default task specific options with default common options
    recursiveMerge(default_options, commonOptions());

    // Overwrite default values with values specified in the target
    var options = this.options(default_options);
    verboseInspect('createJiraVersion options: ', options);

    // Get a Jira connection
    var jira = jiraCnn(options);

    // Chainable method that adds a comment to an issue
    function addJiraVersion() {
      var deferred = q.defer();

      // If the description is a file path, use its contents as the description
      var description = resolveContent(options.description);

      // json that Jira API is expecting
      var version_json = {
        'project': options.project_key,
        'name': options.name,
        'description': description,
        'archived': options.archived,
        'released': options.released,
        'releaseDate': options.release_date,
        'startDate': options.start_date
      };
      verboseInspect('Create version json: ', version_json);

      // Pass version object to node-jira
      jira.createVersion(version_json, function(error, response){
        if (error) {
          deferred.reject(error);
        } else {
          deferred.resolve(response);
        }
      });

      return deferred.promise;
    }

    // Call the transition issue method
    addJiraVersion()
      .then(function(response){
        verboseInspect('Add version response: ', response);
      })
      .catch(function(error){
        verboseInspect('Add version error: ', error);
        grunt.fatal(error);
      })
      .done(function(){
        grunt.log.writeln('Add version completed');
        done();
      });

  });


  /*
   Search Jira
   */
  grunt.registerMultiTask('searchJira', 'Search JIRA with JQL', function() {

    var done = this.async();

    // Setup task specific default options
    var default_options = {
      search_string: null,
      start_at: 0,
      max_results: 9999,
      fields: null,
      before_search: [],    // optional grunt tasks to run before search
      after_search: []     // optional grunt tasks to run after search
    };

    // Extend default task specific options with default common options
    recursiveMerge(default_options, commonOptions());

    // Overwrite default values with values specified in the target
    var options = this.options(default_options);
    verboseInspect('searchJira options: ', options);

    // Get a Jira connection
    var jira = jiraCnn(options);

    // Chainable method that adds a comment to an issue
    function searchJira() {
      var deferred = q.defer();

      // If the search_string is a file path, use its contents as the search_string
      var search_string = resolveContent(options.search_string);

      // json that Jira API is expecting
      var search_json = {
        'startAt': options.start_at,
        'maxResults': options.max_results,
        'fields': options.fields
      };
      grunt.verbose.writeln('JQL search_string: ' +  options.search_string);
      verboseInspect('Search json: ', search_json);

      // Pass version object to node-jira
      jira.searchJira(options.search_string, search_json, function(error, response){
        if (error) {
          deferred.reject(error);
        } else {
          grunt.verbose.writeln('JQL search returned ' +  response.total + ' items');
          //verboseInspect('JQL search response: ', response);
          // Loop over and add to cache
          var i,
              issue,
              results = {};
          for (i in response.issues) {
            issue = response.issues[i];
            results[issue.key] = {
                id: issue.id,
                key: issue.key,
                summary: issue.fields.summary,
                status_id: issue.fields.status.id,
                status: issue.fields.status.name
              };
          }
          deferred.resolve(results);
        }
      });

      return deferred.promise;
    }

    // Call the transition issue method
    searchJira()
      .then(function(results){
        verboseInspect('Jira search results: ', results);
        grunt.config(this.target + 'search_results', results);
      })
      .catch(function(error){
        verboseInspect('Jira search error: ', error);
        grunt.fatal(error);
      })
      .done(function(){
        grunt.log.writeln('Jira search completed');
        done();
      });

  });




  /*
   Lookup Jira Project
   */
  grunt.registerMultiTask('jiraProjectDetails', 'Lookup a JIRA project\'s details', function(project_key) {

    var done = this.async();

    // Setup task specific default options
    var default_options = {
      project_key: null
    };

    // Extend default task specific options with default common options
    recursiveMerge(default_options, commonOptions());

    // Overwrite default values with values specified in the target
    var options = this.options(default_options);
    verboseInspect('jiraProjectDetails options: ', options);

    // Get a Jira connection
    var jira = jiraCnn(options);

    // Chainable method that adds a comment to an issue
    function getProject() {
      var deferred = q.defer();

      // Pass version object to node-jira
      jira.getProject(options.project_key, function(error, response){
        if (error) {
          deferred.reject(error);
        } else {
          deferred.resolve(response);
        }
      });

      return deferred.promise;
    }

    // Call the transition issue method
    getProject()
      .then(function(response){
        verboseInspect('Jira project response: ', response);
      })
      .catch(function(error){
        verboseInspect('Jira project error: ', error);
        grunt.fatal(error);
      })
      .done(function(){
        grunt.log.writeln('Jira project completed');
        done();
      });

  });

};
