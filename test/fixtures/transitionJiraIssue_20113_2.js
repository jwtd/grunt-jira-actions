var nock = require('nock');

nock('https://virtru.atlassian.net:443')
  .post('/rest/api/2/issue/20113/transitions', {"transition":{"id":"2"}})
  .reply(204, "", { server: 'nginx',
  date: 'Sat, 14 Mar 2015 22:08:38 GMT',
  'content-type': 'application/json;charset=UTF-8',
  'content-length': '0',
  connection: 'keep-alive',
  'x-arequestid': '1088x86122x1',
  'x-asessionid': '1ibllm7',
  'x-asen': 'SEN-2594513',
  'set-cookie': 
   [ 'studio.crowd.tokenkey=""; Domain=.virtru.atlassian.net; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=GKVqt3sbKeUqLwSJOD6KoA00; Domain=.virtru.atlassian.net; Path=/; Secure; HttpOnly',
     'JSESSIONID=239410C486FCC722947304EC0B0EC006; Path=/; Secure; HttpOnly' ],
  'x-seraph-loginreason': 'OUT, OK',
  'x-ausername': 'jordan',
  'cache-control': 'no-cache, no-store, no-transform',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=315360000;includeSubdomains' });
