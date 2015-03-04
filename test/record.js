var nock = require('nock');
var path = require('path');
var fs = require('fs');

module.exports = function (name, options) {

  // Options tell us where to store our fixtures
  options = options || {};

  // Default options
  var test_folder = options.test_folder || 'test';
  var fixtures_folder = options.fixtures_folder || 'fixtures';
  var fp = path.join(test_folder, fixtures_folder, name + '.js');

  /*
  `has_fixtures` indicates whether the test has fixtures we should read,
  or doesn't, so we should record and save them.
  the environment variable `NOCK_RECORD` can be used to force a new recording.
  */
  var has_fixtures = !!process.env.NOCK_RECORD;

  return {

    // Use existing fixture, or start recording to create a new one
    before: function () {
      if (!has_fixtures) try {
        //console.log('Nock Recording BEFORE()');
        require('../' + fp);
        has_fixtures = true;
      } catch (e) {
        //console.log('Exception: ' + e);
        console.log('Recording new fixture');
        nock.recorder.rec({
          dont_print: true
        });
      } else {
        console.log('Recording new fixture');
        has_fixtures = false;
        nock.recorder.rec({
          dont_print: true
        });
      }
    },

    // If a recording was created, save it as a new fixuture
    after: function () {
      if (!has_fixtures) {
        //console.log('Nock Recording AFTER()');
        has_fixtures = nock.recorder.play();
        var text = "var nock = require('nock');\n" + has_fixtures.join('\n');
        console.log(text);
        fs.writeFileSync(fp, text);
      }
    }
  }
};