var nock = require('nock');

nock('https://virtru.atlassian.net:443')
  .post('/rest/api/2/issue', {"fields":{"project":{"id":10400},"issuetype":{"name":"Story"},"summary":"Story marked as done"}})
  .reply(201, {"id":"20035","key":"GEN-401","self":"https://virtru.atlassian.net/rest/api/2/issue/20035"}, { server: 'nginx',
  date: 'Thu, 12 Mar 2015 03:42:20 GMT',
  'content-type': 'application/json;charset=UTF-8',
  'transfer-encoding': 'chunked',
  connection: 'keep-alive',
  'x-arequestid': '1422x71822x1',
  'x-asen': 'SEN-2594513',
  'set-cookie': 
   [ 'JSESSIONID=07D20C19790941EC8F7240C786E9A896; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=""; Domain=.virtru.atlassian.net; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=Bkld5Sg1qNHFOLyOCd7cVQ00; Domain=.virtru.atlassian.net; Path=/; Secure; HttpOnly',
     'atlassian.xsrf.token=BW7E-GFUY-04Z2-VPGF|91160167a350c14cf22f46dd65a9f98d421b265f|lin; Path=/; Secure' ],
  'x-seraph-loginreason': 'OUT, OK',
  'x-asessionid': 'ai6op1',
  'x-ausername': 'jordan',
  'cache-control': 'no-cache, no-store, no-transform',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=315360000;includeSubdomains' });
