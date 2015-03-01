var nock = require('nock');

nock('https://virtru.atlassian.net:443')
  .post('/rest/api/2/issue', {"fields":{"project":{"id":10400},"issuetype":{"name":"Story"},"summary":"This is the foo story summary","description":"This is the foo story description."}})
  .reply(201, {"id":"19706","key":"GEN-259","self":"https://virtru.atlassian.net/rest/api/2/issue/19706"}, { server: 'nginx',
    date: 'Sun, 01 Mar 2015 05:05:39 GMT',
    'content-type': 'application/json;charset=UTF-8',
    'transfer-encoding': 'chunked',
    connection: 'keep-alive',
    'x-arequestid': '5x42672x1',
    'x-asen': 'SEN-2594513',
    'set-cookie':
      [ 'JSESSIONID=D27D63DD52982784A78FDA9FF2DD7C2B; Path=/; Secure; HttpOnly',
        'studio.crowd.tokenkey=""; Domain=.virtru.atlassian.net; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/; Secure; HttpOnly',
        'studio.crowd.tokenkey=tPaFGxC6J17je0fjh9xC6g00; Domain=.virtru.atlassian.net; Path=/; Secure; HttpOnly',
        'atlassian.xsrf.token=BW7E-GFUY-04Z2-VPGF|de81d91bfe15ec7f1401ae98a293bbe3f371a6f2|lin; Path=/; Secure' ],
    'x-seraph-loginreason': 'OUT, OK',
    'x-asessionid': '1i9zck9',
    'x-ausername': 'jordan',
    'cache-control': 'no-cache, no-store, no-transform',
    'x-content-type-options': 'nosniff',
    'strict-transport-security': 'max-age=315360000;includeSubdomains' });