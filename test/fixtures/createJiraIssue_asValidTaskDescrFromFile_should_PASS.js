var nock = require('nock');

nock('https://virtru.atlassian.net:443')
  .post('/rest/api/2/issue', {"fields":{"project":{"id":10400},"issuetype":{"name":"Task"},"summary":"Task with summary and description from a filepath","description":"As a foo, I would like bar, so that I don't have to baz.\n\n*Acceptance Criteria*\n* Bar must exist\n* Foo should not have to baz\n* Bazz should not be present\n\n*Details*\nLook up bar with [Google Search|http://www.google.com]."}})
  .reply(201, {"id":"19940","key":"GEN-364","self":"https://virtru.atlassian.net/rest/api/2/issue/19940"}, { server: 'nginx',
  date: 'Thu, 05 Mar 2015 04:56:21 GMT',
  'content-type': 'application/json;charset=UTF-8',
  'transfer-encoding': 'chunked',
  connection: 'keep-alive',
  'x-arequestid': '1436x39875x1',
  'x-asen': 'SEN-2594513',
  'set-cookie': 
   [ 'JSESSIONID=725F4CDD7008DDAA1D0083412984751B; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=""; Domain=.virtru.atlassian.net; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=tPaFGxC6J17je0fjh9xC6g00; Domain=.virtru.atlassian.net; Path=/; Secure; HttpOnly',
     'atlassian.xsrf.token=BW7E-GFUY-04Z2-VPGF|d43688f6db99db96d9bb4f9627e24656a5d5d2bf|lin; Path=/; Secure' ],
  'x-seraph-loginreason': 'OUT, OK',
  'x-asessionid': '14fylrm',
  'x-ausername': 'jordan',
  'cache-control': 'no-cache, no-store, no-transform',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=315360000;includeSubdomains' });
