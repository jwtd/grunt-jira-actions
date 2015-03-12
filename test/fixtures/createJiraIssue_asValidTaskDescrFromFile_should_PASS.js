var nock = require('nock');

nock('https://virtru.atlassian.net:443')
  .post('/rest/api/2/issue', {"fields":{"project":{"id":10400},"issuetype":{"name":"Task"},"summary":"Task with summary and description from a filepath","description":"As a foo, I would like bar, so that I don't have to baz.\n\n*Acceptance Criteria*\n* Bar must exist\n* Foo should not have to baz\n* Bazz should not be present\n\n*Details*\nLook up bar with [Google Search|http://www.google.com]."}})
  .reply(201, {"id":"20034","key":"GEN-400","self":"https://virtru.atlassian.net/rest/api/2/issue/20034"}, { server: 'nginx',
  date: 'Thu, 12 Mar 2015 03:42:18 GMT',
  'content-type': 'application/json;charset=UTF-8',
  'transfer-encoding': 'chunked',
  connection: 'keep-alive',
  'x-arequestid': '1422x71821x1',
  'x-asen': 'SEN-2594513',
  'set-cookie': 
   [ 'JSESSIONID=D3BF05A1F8D56C4B8C2C80F416B0E5F1; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=""; Domain=.virtru.atlassian.net; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=Bkld5Sg1qNHFOLyOCd7cVQ00; Domain=.virtru.atlassian.net; Path=/; Secure; HttpOnly',
     'atlassian.xsrf.token=BW7E-GFUY-04Z2-VPGF|7074522ae831b09eff22ba545db762706fcc2a05|lin; Path=/; Secure' ],
  'x-seraph-loginreason': 'OUT, OK',
  'x-asessionid': 'qalgpx',
  'x-ausername': 'jordan',
  'cache-control': 'no-cache, no-store, no-transform',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=315360000;includeSubdomains' });
