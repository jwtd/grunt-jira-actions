'use strict';

// nodeunit
var util = require('util'),
    path = require('path'),
    grunt = require('grunt'),
    exec = require('child_process').exec;


// Duplicate the environment object
// NOTE: Environment variables in child processes are always strings
var envDup = [],
    envVar;
for (envVar in process.env) {
  if (process.env.hasOwnProperty(envVar)) {
    envDup[envVar] = process.env[envVar];
  }
}

// Prepare configuration for exec calls
var execOptions = {
  cwd: path.join(__dirname, '..'),  // Run in tests directory
  env: envDup                       // Pass in the duplicated env variables
  //encoding: 'utf8',
  //timeout: 0,            // kill child process if it runs longer than timeout milliseconds
  //maxBuffer: 200*1024,   // kill child process if data in stdout or stderr exceeds this limit
  //killSignal: 'SIGTERM'  // The child process is killed with killSignal (default: 'SIGTERM')
};


module.exports = {

  envDup: envDup,

  // Call grunt with the correct flags
  callGrunt: function (task, whenDoneCallback) {
    exec('grunt ' + task + ' --env=TEST --no-color', execOptions, whenDoneCallback);
  },

  parseTestOutput: function(s) {
    var n;
    var blocks = s.split('||||');
    for (n in blocks) {
      if (blocks.hasOwnProperty(n)) {
        console.log('** ' + n + ' **\n' + blocks[n]);
      }
    }
    //console.log('Inspect Object :: ' + util.inspect(blocks, {showHidden: false, depth: null}));
  },

  // Call grunt with the correct flags
  splitOutput: function (s) {
    return s.split('||||');
  }

};