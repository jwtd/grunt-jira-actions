var should = require('should'),
    fs = require('fs');


describe('Jira Story', function(){

  describe('creation request', function(){

    var actual = JSON.parse(fs.readFileSync('tests/data/actual/story-request.json'));
    var expected = JSON.parse(fs.readFileSync('tests/data/expected/story-request.json'));

    it('should set the host correctly', function(){
        actual.headers.host.should.be.equal(expected.headers.host);
    });

    it('should set authorization header correctly', function(){
        actual.headers.authorization.should.be.equal(expected.headers.authorization);
    });

    it('should set url correctly', function(){
        actual.url.should.be.equal(expected.url);
    });

    it('should send the correct body', function(){

      // removing the date field, as this cannot be included in a direct compare
      var actual_no_dates = JSON.parse(fs.readFileSync('tests/data/actual/story-request.json'));
      var expected_no_dates = JSON.parse(fs.readFileSync('tests/data/expected/story-request.json'));

      // TODO: Update date fields
      //actual_no_dates.body.fields.customfield_11502 = null;
      //expected_no_dates.body.fields.customfield_11502 = null;
      //actual_no_dates.body.should.be.eql(expected_no_dates.body);

    });

    it('should have the correct date in the body', function(){
      // TODO: Update date fields
      //var actual_date = new Date(actual.body.fields.customfield_11502);
      //var one_minute_in_the_past = new Date().getTime() - 60000;
      //actual_date.getTime().should.be.above(one_minute_in_the_past)
    });
  });

  describe('transition story to done', function(){

    var actual = JSON.parse(fs.readFileSync('tests/data/actual/transition-to-done-request.json'));
    var expected = JSON.parse(fs.readFileSync('tests/data/expected/transition-to-done-request.json'));

    it('should set the host correctly', function(){
        actual.headers.host.should.be.equal(expected.headers.host);
    });

    it('should set authorization header correctly', function(){
        actual.headers.authorization.should.be.equal(expected.headers.authorization);
    });

    it('should set url correctly', function(){
        actual.url.should.be.equal(expected.url);
    });

    it('should send the correct body', function(){
        actual.body.should.be.eql(expected.body);
    });
  });
});
