var nock = require('nock');

nock('https://virtru.atlassian.net:443')
  .post('/rest/api/2/issue', {"fields":{"project":{"id":10400},"issuetype":{"name":"Story"},"summary":"Issue from project_id, jira_host, summary, and defaults for everything else"}})
  .reply(201, {"id":"20032","key":"GEN-398","self":"https://virtru.atlassian.net/rest/api/2/issue/20032"}, { server: 'nginx',
  date: 'Thu, 12 Mar 2015 03:42:14 GMT',
  'content-type': 'application/json;charset=UTF-8',
  'transfer-encoding': 'chunked',
  connection: 'keep-alive',
  'x-arequestid': '1422x71819x1',
  'x-asen': 'SEN-2594513',
  'set-cookie': 
   [ 'JSESSIONID=5C79AA8736AFABFB385F9587AD8AA9F5; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=""; Domain=.virtru.atlassian.net; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=Bkld5Sg1qNHFOLyOCd7cVQ00; Domain=.virtru.atlassian.net; Path=/; Secure; HttpOnly',
     'atlassian.xsrf.token=BW7E-GFUY-04Z2-VPGF|5a3fa24471eb8985534022f4098392a821666525|lin; Path=/; Secure' ],
  'x-seraph-loginreason': 'OUT, OK',
  'x-asessionid': '295dkr',
  'x-ausername': 'jordan',
  'cache-control': 'no-cache, no-store, no-transform',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=315360000;includeSubdomains' });
