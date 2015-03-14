var nock = require('nock');

nock('https://virtru.atlassian.net:443')
  .post('/rest/api/2/issue/19935/comment', {"body":"I took a look at bar, and it doesn't seem feasible. Foo will just have to bar until we figure it out.\n\nFeel free to use [Google Search|http://www.google.com] to verify my research."})
  .reply(201, {"self":"https://virtru.atlassian.net/rest/api/2/issue/19935/comment/24713","id":"24713","author":{"self":"https://virtru.atlassian.net/rest/api/2/user?username=jordan","name":"jordan","key":"jordan","emailAddress":"jordan@virtru.com","avatarUrls":{"48x48":"https://virtru.atlassian.net/secure/useravatar?ownerId=jordan&avatarId=11700","24x24":"https://virtru.atlassian.net/secure/useravatar?size=small&ownerId=jordan&avatarId=11700","16x16":"https://virtru.atlassian.net/secure/useravatar?size=xsmall&ownerId=jordan&avatarId=11700","32x32":"https://virtru.atlassian.net/secure/useravatar?size=medium&ownerId=jordan&avatarId=11700"},"displayName":"Jordan Duggan","active":true,"timeZone":"America/New_York"},"body":"I took a look at bar, and it doesn't seem feasible. Foo will just have to bar until we figure it out.\n\nFeel free to use [Google Search|http://www.google.com] to verify my research.","updateAuthor":{"self":"https://virtru.atlassian.net/rest/api/2/user?username=jordan","name":"jordan","key":"jordan","emailAddress":"jordan@virtru.com","avatarUrls":{"48x48":"https://virtru.atlassian.net/secure/useravatar?ownerId=jordan&avatarId=11700","24x24":"https://virtru.atlassian.net/secure/useravatar?size=small&ownerId=jordan&avatarId=11700","16x16":"https://virtru.atlassian.net/secure/useravatar?size=xsmall&ownerId=jordan&avatarId=11700","32x32":"https://virtru.atlassian.net/secure/useravatar?size=medium&ownerId=jordan&avatarId=11700"},"displayName":"Jordan Duggan","active":true,"timeZone":"America/New_York"},"created":"2015-03-14T17:21:27.469-0400","updated":"2015-03-14T17:21:27.469-0400"}, { server: 'nginx',
  date: 'Sat, 14 Mar 2015 21:21:27 GMT',
  'content-type': 'application/json;charset=UTF-8',
  'transfer-encoding': 'chunked',
  connection: 'keep-alive',
  'x-arequestid': '1041x86068x1',
  'x-asen': 'SEN-2594513',
  'set-cookie': 
   [ 'JSESSIONID=08EFAD6DE250FA294BEE37546FCD6B17; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=""; Domain=.virtru.atlassian.net; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=Hx42tJQAlX0iF4SEUlfR1w00; Domain=.virtru.atlassian.net; Path=/; Secure; HttpOnly',
     'atlassian.xsrf.token=BW7E-GFUY-04Z2-VPGF|35e7d62d9837c64c776d4f2f707a2fc90e2905f4|lin; Path=/; Secure' ],
  'x-seraph-loginreason': 'OUT, OK',
  'x-asessionid': '1kfe33j',
  'x-ausername': 'jordan',
  location: 'https://virtru.atlassian.net/rest/api/2/issue/19935/comment/24713',
  'cache-control': 'no-cache, no-store, no-transform',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=315360000;includeSubdomains' });
