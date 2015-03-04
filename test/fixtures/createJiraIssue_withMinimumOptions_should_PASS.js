var nock = require('nock');

nock('https://virtru.atlassian.net:443')
  .post('/rest/api/2/issue', {"fields":{"project":{"id":10400},"issuetype":{"name":"Story"},"summary":"Issue from project_id, jira_host, summary, and defaults for everything else"}})
  .reply(201, {"id":"19881","key":"GEN-305","self":"https://virtru.atlassian.net/rest/api/2/issue/19881"}, { server: 'nginx',
  date: 'Wed, 04 Mar 2015 23:32:17 GMT',
  'content-type': 'application/json;charset=UTF-8',
  'transfer-encoding': 'chunked',
  connection: 'keep-alive',
  'x-arequestid': '1112x38671x1',
  'x-asen': 'SEN-2594513',
  'set-cookie': 
   [ 'JSESSIONID=94D7B9D93E8ADA9F6C5FFBD7EED55E68; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=""; Domain=.virtru.atlassian.net; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=tPaFGxC6J17je0fjh9xC6g00; Domain=.virtru.atlassian.net; Path=/; Secure; HttpOnly',
     'atlassian.xsrf.token=BW7E-GFUY-04Z2-VPGF|4754b86556dec7541f35f12c5c4d039a0d199d86|lin; Path=/; Secure' ],
  'x-seraph-loginreason': 'OUT, OK',
  'x-asessionid': '1ab287d',
  'x-ausername': 'jordan',
  'cache-control': 'no-cache, no-store, no-transform',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=315360000;includeSubdomains' });
