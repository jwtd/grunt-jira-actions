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

  grunt.registerMultiTask('jira_tasks', 'Create a story in JIRA', function() {

    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });
    grunt.verbose.writeflags(options);


    var createStory = function(){
      grunt.verbose.writeln("Creating story");

      var story_json = options.story,
          deferred = q.defer();

      grunt.verbose.writeln(JSON.stringify(story));

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
        json: story_json
      }, function(error, response, body){
        if (error) {
          deferred.reject(error);
        }
        else if (response.statusCode >= 300 ) {
          deferred.reject(response.statusCode + " - bad response: " + JSON.stringify(response));
        }
        else {
          var storyId = body.id;
          grunt.log.writeln('Story ID is: ' + storyId);
          deferred.resolve(storyId);
        }
      });

      return deferred.promise;
    };


    // Update the status of a story to done
    var updateStaryToDone = function(storyId){
      grunt.verbose.writeln("Updating story to 'Done' state");

      var deferred = q.defer();

      request({
        url: options.jira.api_url + util.format("issue/%s/transitions", storyId),
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
            "id": options.jira.story_done_state
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
          deferred.resolve(storyId);
        }
      });

      return deferred.promise;
    };

    // Call the create story method and then mark it as done
    createStory()
      .then(function(storyId){
        return updateStoryToDone(storyId);
      })
      .catch(function(error){
        grunt.fatal(error);
      })
      .done(function(){
        grunt.log.writeln("Story created and marked as done.");
        done();
      });

  });

};
