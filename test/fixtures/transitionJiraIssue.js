var nock = require('nock');

nock('https://virtru.atlassian.net:443')
  .post('/rest/api/2/issue/20060/transitions', {"transition":{"id":"2"}})
  .reply(204, "", { server: 'nginx',
  date: 'Thu, 12 Mar 2015 03:51:00 GMT',
  'content-type': 'application/json;charset=UTF-8',
  'content-length': '0',
  connection: 'keep-alive',
  'x-arequestid': '1431x71870x1',
  'x-asessionid': '5rnezt',
  'x-asen': 'SEN-2594513',
  'set-cookie': 
   [ 'studio.crowd.tokenkey=""; Domain=.virtru.atlassian.net; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=airA1AEwtuyvyR6CuMWVYA00; Domain=.virtru.atlassian.net; Path=/; Secure; HttpOnly',
     'JSESSIONID=155972114F84B9B81790DB0B40321A8C; Path=/; Secure; HttpOnly' ],
  'x-seraph-loginreason': 'OUT, OK',
  'x-ausername': 'jordan',
  'cache-control': 'no-cache, no-store, no-transform',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=315360000;includeSubdomains' });
