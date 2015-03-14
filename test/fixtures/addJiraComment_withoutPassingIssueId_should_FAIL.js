var nock = require('nock');

nock('https://virtru.atlassian.net:443')
  .post('/rest/api/2/issue/undefined/comment', {"body":"This should fail, because no issue id was passed in when it was called."})
  .reply(404, {"errorMessages":["Issue Does Not Exist"],"errors":{}}, { server: 'nginx',
  date: 'Sat, 14 Mar 2015 22:16:15 GMT',
  'content-type': 'application/json;charset=UTF-8',
  'transfer-encoding': 'chunked',
  connection: 'keep-alive',
  vary: 'Accept-Encoding',
  'x-arequestid': '1096x86141x1',
  'x-asen': 'SEN-2594513',
  'set-cookie': 
   [ 'JSESSIONID=60C7F47E45CB3DFC4F082CD204224DC4; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=""; Domain=.virtru.atlassian.net; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=GKVqt3sbKeUqLwSJOD6KoA00; Domain=.virtru.atlassian.net; Path=/; Secure; HttpOnly',
     'atlassian.xsrf.token=BW7E-GFUY-04Z2-VPGF|9a5c3c8ad8cd639d0d75ef22f1f72cf5d1dbb183|lin; Path=/; Secure' ],
  'x-seraph-loginreason': 'OUT, OK',
  'x-asessionid': 'x9btda',
  'x-ausername': 'jordan',
  'cache-control': 'no-cache, no-store, no-transform',
  'x-content-type-options': 'nosniff' });
