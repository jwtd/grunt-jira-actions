var nock = require('nock');

nock('https://virtru.atlassian.net:443')
  .post('/rest/api/2/issue/20076/transitions', {"transition":{"id":"2"}})
  .reply(204, "", { server: 'nginx',
  date: 'Fri, 13 Mar 2015 02:36:38 GMT',
  'content-type': 'application/json;charset=UTF-8',
  'content-length': '0',
  connection: 'keep-alive',
  'x-arequestid': '1356x78200x1',
  'x-asessionid': '10pwwge',
  'x-asen': 'SEN-2594513',
  'set-cookie': 
   [ 'studio.crowd.tokenkey=""; Domain=.virtru.atlassian.net; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=riDSAtGzQEjEk7BOg1sLkw00; Domain=.virtru.atlassian.net; Path=/; Secure; HttpOnly',
     'JSESSIONID=DDCC9AB36ACC07A027FF64DB3F55AACB; Path=/; Secure; HttpOnly' ],
  'x-seraph-loginreason': 'OUT, OK',
  'x-ausername': 'jordan',
  'cache-control': 'no-cache, no-store, no-transform',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=315360000;includeSubdomains' });
