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
    JiraApi = require('jira').JiraApi,
    record = require(process.env.PWD + '/test/record'); //, {fixtures_folder: path.resolve(__dirname});

module.exports = function(grunt) {


  // Determine run parameters.
  var TESTING = grunt.option('env') === 'TEST';

  // If testing, force verbose on so tests can read output via stdout from exec calls
  if (TESTING) {
    grunt.option('verbose', true);
  }
  var VERBOSE = !!grunt.option('verbose');
  grunt.verbose.writeln('TESTING: ' + TESTING);
  grunt.log.writeln('VERBOSE: ' + VERBOSE);

  // When testing or when verbose is enabled, display the object's structure
  function writeToConsole(msg, obj) {
    if (TESTING) {
      grunt.log.writeln(msg + '\n||||\n' + JSON.stringify(obj) + '\n||||');
    } else if (VERBOSE) {
      grunt.log.writeln(msg + JSON.stringify(obj));
    }
  }

  // Prepare nock to record and mock HTTP calls when env=TEST
  var recorder = null;

  // Start nock recorder
  function startRecord(name) {
    if (TESTING) {
      grunt.verbose.writeln('START NOCK RECORDING: ' + name);
      recorder = record(name);
      recorder.before();
    }
  }

  // Stop nock recorder
  function stopRecord() {
    if (TESTING) {
      grunt.verbose.writeln('STOP NOCK RECORDING');
      recorder.after();
    }
  }


  // Build a fresh version of the Jira global config each time in case overrides were used in a previous task
  function commonOptions() {
    return {
      env_var_for_jira_username: grunt.config('env_var_for_jira_username') || 'JIRA_UN',
      env_var_for_jira_password: grunt.config('env_var_for_jira_password') || 'JIRA_PW',
      jira_protocol: grunt.config('jira_protocol') || 'https',
      jira_host: grunt.config('jira_host') || null,
      jira_port: grunt.config('jira_port') || 443,
      jira_api_version: grunt.config('jira_api_version') || '2'
    };
  }


  // Add or update existing properties on obj1 with values from obj2
  function recursiveMerge(obj1, obj2) {
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


  // Make sure Jira credentials have been set in ENV
  function validateEnvVars(env_un, env_pw) {
    if (!process.env[env_un]) {
      grunt.fail.fatal('Environment variable not found. ENV[' + env_un + '] must be set or JIRA calls will fail.');
    }
    if (!process.env[env_pw]) {
      grunt.fail.fatal('Environment variable not found. ENV[' + env_pw + '] must be set or JIRA calls will fail.');
    }
  }


  // Fail if option is not null
  function validatePresenceOf(opt, val){
    // Make sure val is in an array
    if (val.constructor === String){
      val = [val];
    }
    var v,
        missing = '';
    for (v in val) {
      if (opt[val[v]] == null) {
        missing += '\nRequired option ' + val[v] + ' was null';
      }
    }
    if (missing !== '') {
      grunt.fail.fatal(missing);
    }
  }


  function getCurrentAction(obj) {
    return obj.nameArgs.replace(/:/g, '_');
  }


  function unpackJiraError(error) {
    var e,
        emsg = [];
    for (e in error.errors) {
      if (error.errors.hasOwnProperty(e)) {
        emsg.push(error.errors[e]);
      }
    }
    grunt.fail.fatal(emsg.join(', '));
  }


  // If a string reference is a valid file path, use its contents as the string, otherwise return the string
  function resolveContent(ref) {

    // If ref is null, return null
    if (!ref){
      return null;
    }

    // If ref is a file, extract the contents
    var content = ref;
    if (grunt.file.exists(ref)) {
      var ext = ref.split('.').pop().toLowerCase();
      grunt.verbose.writeln('Extracting content from contents of ' + ext + ' file ' + ref);
      if (ext === 'json') {
        content = grunt.file.readJSON(ref);
      } else {
        content = grunt.file.read(ref);
      }
    } else {
      // Content was not a file, so use it as is
      grunt.verbose.writeln('Content was not a file reference');
    }
    return content;
  }


  // Make sure Jira credentials have been set in ENV
  function jiraCnn(opt) {

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



  // Setup global Jira configuration
  grunt.registerTask('setJiraConfig', 'Set common JIRA configuration to be used as defaults for all Jira Action tasks and targets', function() {

    // Overwrite default values with values specified in the target
    var options = this.options(commonOptions());
    writeToConsole('setJiraConfig options: ', options);

    // Make sure Jira creds are set
    validateEnvVars(options.env_var_for_jira_username, options.env_var_for_jira_password);

    // Save Jira options as global config
    grunt.config('env_var_for_jira_username', options.env_var_for_jira_username);
    grunt.config('env_var_for_jira_password', options.env_var_for_jira_password);
    grunt.config('jira_protocol', options.jira_protocol);
    grunt.config('jira_host', options.jira_host);
    grunt.config('jira_port', options.jira_port);
    grunt.config('jira_api_version', options.jira_api_version);

    // Output for tests
    writeToConsole('grunt.config', grunt.config);

  });


  // Create a Jira issue
  grunt.registerMultiTask('createJiraIssue', 'Create an issue in JIRA', function() {

    // Reveal task, target, and options
    var current_action = getCurrentAction(this);

    // Prepare promise chain for API calls (which are asynchronous)
    var done = this.async();

    // Setup task specific default options
    var default_options = {
      issue_type: 'Story',   // Story, Epic, Task, Technical Task, Sub-Task, Bug, Improvement, New Feature
      issue_state: 1,        // 1 = Open, 2 = Closed
      project_id: null,
      summary: null,
      description: null,
      additional_fields: null  // JSON that should be merged into the request
    };

    // Extend default task specific options with default common options
    recursiveMerge(default_options, commonOptions());

    // Overwrite default values with values specified in the target
    var options = this.options(default_options);
    writeToConsole('Create issue options', options);

    // Validate presence of values for required options
    validatePresenceOf(options, ['project_id', 'summary']);

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
          'summary': options.summary
        }
      };

      // If a description is provided, add it
      if (description != null){
        console.log(description);
        issue_json.fields.description = description;
      }

      // Add any other options passed in to the JSON
      if (options.additional_fields != null){
        recursiveMerge(issue_json.fields, options.additional_fields);
      }
      writeToConsole('Create issue json', issue_json);

      // Call Jira REST API using node-jira

      jira.addNewIssue(issue_json, function(error, response){
        if (error) {
          deferred.reject(error);
        } else {
          writeToConsole('Create issue response', response);
          grunt.log.writeln('Issue created (id = ' + response.id + ') ' + response.key + ' : ' + options.summary);
          deferred.resolve(response.id);
        }
      });

      return deferred.promise;
    }

    // Call the create issue method and then transition it if necessary
    startRecord(current_action);
    createJiraIssue()
      .then(function(issue_id){
        stopRecord();
        grunt.config('jira.last_issue_id', issue_id);
        if (options.issue_state > 1) {
          grunt.task.run('transitionJiraIssue:' + issue_id + ':' + options.issue_state);
        }
      })
      .catch(function(error){
        stopRecord();
        writeToConsole('Create issue error', error);
        unpackJiraError(error);
      })
      .done(function(){
        grunt.verbose.writeln('Create issue completed');
        done();
      });

  });



  // Transition a Jira issue
  grunt.registerTask('transitionJiraIssue', 'Transition an issue in JIRA', function(issue_id, issue_state) {

    // Reveal task, target, and options
    var current_action = getCurrentAction(this);

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
    writeToConsole('Transition issue options', options);

    // Validate presence of values for required options
    validatePresenceOf(options, ['issue_id', 'issue_state']);

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
      writeToConsole('Transition issue json', transition_json);

      jira.transitionIssue(options.issue_id, transition_json, function(error, response){
        if (error) {
          deferred.reject(error);
        } else {
          deferred.resolve(response);
        }
      });

      return deferred.promise;
    }

    // Call the transition issue method and then transition it if necessary
    startRecord(current_action);
    transitionJiraIssue()
      .then(function(response){
        stopRecord();
        writeToConsole('Transition response', response);
      })
      .catch(function(error){
        stopRecord();
        writeToConsole('Transition issue error', error);
        unpackJiraError(error);
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

    // Reveal task, target, and options
    var current_action = getCurrentAction(this);

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
    writeToConsole('Link issue options', options);

    // Validate presence of values for required options
    validatePresenceOf(options, ['from_issue_key', 'to_issue_key']);

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
      writeToConsole('Link issue json', link_json);

      jira.issueLink(link_json, function(error, response){
        if (error) {
          deferred.reject(error);
        } else {
          deferred.resolve(response);
        }
      });

      return deferred.promise;
    }

    // Call the transition issue method and then transition it if necessary
    startRecord(current_action);
    linkJiraIssues()
      .then(function(response){
        stopRecord();
        writeToConsole('Link issues response', response);
      })
      .catch(function(error){
        stopRecord();
        writeToConsole('Link issues error', error);
        unpackJiraError(error);
      })
      .done(function(){
        grunt.log.writeln('Link issues completed');
        done();
      });

  });



  // Comment on a Jira issue
  grunt.registerMultiTask('addJiraComment', 'Add a comment to an issue in JIRA', function(issue_id) {

    // Reveal task, target, and options
    var current_action = getCurrentAction(this);

    // Prepare promise chain for API calls (which are asynchronous)
    var done = this.async();

    // Setup task specific default options
    var default_options = {
      issue_id: issue_id || grunt.config('jira.last_issue_id'),
      comment: null
    };

    // Extend default task specific options with default common options
    recursiveMerge(default_options, commonOptions());

    // Overwrite default values with values specified in the target
    var options = this.options(default_options);
    writeToConsole('Add comment options', options);

    // Validate presence of values for required options
    validatePresenceOf(options, ['issue_id', 'comment']);

    // Get a Jira connection
    var jira = jiraCnn(options);

    // If the comment is a file path, use its contents as the comment
    var comment = resolveContent(options.comment);
    writeToConsole('Comment content', comment);

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
    startRecord(current_action);
    addJiraComment()
      .then(function(response){
        stopRecord();
        writeToConsole('Add comment response', response);
      })
      .catch(function(error){
        stopRecord();
        writeToConsole('Add comment error', error);
        unpackJiraError(error);
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

    // Reveal task, target, and options
    var current_action = getCurrentAction(this);

    // Prepare promise chain for API calls (which are asynchronous)
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
    writeToConsole('createJiraVersion options', options);

    // Validate presence of values for required options
    validatePresenceOf(options, ['project_key', 'version_name']);

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
      writeToConsole('Create version json', version_json);

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
    startRecord(current_action);
    addJiraVersion()
      .then(function(response){
        stopRecord();
        writeToConsole('Add version response', response);
      })
      .catch(function(error){
        stopRecord();
        writeToConsole('Add version error', error);
        unpackJiraError(error);
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

    // Reveal task, target, and options
    var current_action = getCurrentAction(this);

    // Prepare promise chain for API calls (which are asynchronous)
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
    writeToConsole('searchJira options', options);

    // Validate presence of values for required options
    validatePresenceOf(options, ['search_string']);

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
      grunt.verbose.writeln('JQL search_string: ' + options.search_string);
      writeToConsole('Search json', search_json);

      // Pass version object to node-jira
      jira.searchJira(search_string, search_json, function(error, response){
        if (error) {
          deferred.reject(error);
        } else {
          grunt.verbose.writeln('JQL search returned ' + response.total + ' items');
          //writeToConsole('JQL search response: ', response);
          // Loop over and add to cache
          var i,
              issue,
              results = {};
          for (i in response.issues) {
            if (response.issues.hasOwnProperty(i)) {
              issue = response.issues[i];
              results[issue.key] = {
                id: issue.id,
                key: issue.key,
                summary: issue.fields.summary,
                status_id: issue.fields.status.id,
                status: issue.fields.status.name
              };
            }
          }
          deferred.resolve(results);
        }
      });

      return deferred.promise;
    }

    // Call the transition issue method
    startRecord(current_action);
    searchJira()
      .then(function(results){
        stopRecord();
        writeToConsole('Jira search results', results);
        grunt.config(this.target + 'search_results', results);
      })
      .catch(function(error){
        stopRecord();
        writeToConsole('Jira search error', error);
        unpackJiraError(error);
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

    // Reveal task, target, and options
    var current_action = getCurrentAction(this);

    // Prepare promise chain for API calls (which are asynchronous)
    var done = this.async();

    // Setup task specific default options
    var default_options = {
      project_key: project_key
    };

    // Extend default task specific options with default common options
    recursiveMerge(default_options, commonOptions());

    // Overwrite default values with values specified in the target
    var options = this.options(default_options);
    writeToConsole('jiraProjectDetails options', options);

    // Validate presence of values for required options
    validatePresenceOf(options, ['project_key']);

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
    startRecord(current_action);
    getProject()
      .then(function(response){
        stopRecord();
        writeToConsole('Jira project response', response);
      })
      .catch(function(error){
        stopRecord();
        writeToConsole('Jira project error', error);
        unpackJiraError(error);
      })
      .done(function(){
        grunt.log.writeln('Jira project completed');
        done();
      });

  });


  /*
   Lookup Jira Project Rapid View
   */
  grunt.registerMultiTask('jiraProjectRapidView', 'Lookup a JIRA project\'s rapid view', function(project_key) {

    // Reveal task, target, and options
    var current_action = getCurrentAction(this);

    // Prepare promise chain for API calls (which are asynchronous)
    var done = this.async();

    // Setup task specific default options
    var default_options = {
      project_key: project_key
    };

    // Extend default task specific options with default common options
    recursiveMerge(default_options, commonOptions());

    // Overwrite default values with values specified in the target
    var options = this.options(default_options);
    writeToConsole('jiraProjectDetails options', options);

    // Validate presence of values for required options
    validatePresenceOf(options, ['project_key']);

    // Get a Jira connection
    var jira = jiraCnn(options);

    // Chainable method that adds a comment to an issue
    function getProject() {
      var deferred = q.defer();

      // Pass version object to node-jira
      jira.findRapidView(options.project_key, function(error, response){
        if (error) {
          deferred.reject(error);
        } else {
          deferred.resolve(response);
        }
      });

      return deferred.promise;
    }

    // Call the transition issue method
    startRecord(current_action);
    getProject()
      .then(function(response){
        stopRecord();
        writeToConsole('Jira project rapid view response', response);
      })
      .catch(function(error){
        stopRecord();
        writeToConsole('Jira project rapid view error', error);
        unpackJiraError(error);
      })
      .done(function(){
        grunt.log.writeln('Jira project rapid view completed');
        done();
      });

  });

};
