var nock = require('nock');

nock('https://virtru.atlassian.net:443')
  .post('/rest/api/2/issue', {"fields":{"project":{"id":10400},"issuetype":{"name":"Story"},"summary":"Story with summary and description from a target option","description":"This is the story description as string."}})
  .reply(201, {"id":"20033","key":"GEN-399","self":"https://virtru.atlassian.net/rest/api/2/issue/20033"}, { server: 'nginx',
  date: 'Thu, 12 Mar 2015 03:42:15 GMT',
  'content-type': 'application/json;charset=UTF-8',
  'transfer-encoding': 'chunked',
  connection: 'keep-alive',
  'x-arequestid': '1422x71820x1',
  'x-asen': 'SEN-2594513',
  'set-cookie': 
   [ 'JSESSIONID=C78D750856802FA762A6765194752124; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=""; Domain=.virtru.atlassian.net; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=Bkld5Sg1qNHFOLyOCd7cVQ00; Domain=.virtru.atlassian.net; Path=/; Secure; HttpOnly',
     'atlassian.xsrf.token=BW7E-GFUY-04Z2-VPGF|5a5859af022a966343c47d3a48d5504d46ec7ea4|lin; Path=/; Secure' ],
  'x-seraph-loginreason': 'OUT, OK',
  'x-asessionid': '18fiwv5',
  'x-ausername': 'jordan',
  'cache-control': 'no-cache, no-store, no-transform',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=315360000;includeSubdomains' });
