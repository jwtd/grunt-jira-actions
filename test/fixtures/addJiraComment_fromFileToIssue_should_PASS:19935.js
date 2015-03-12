var nock = require('nock');

nock('https://virtru.atlassian.net:443')
  .post('/rest/api/2/issue/19935/comment', {"body":"I took a look at bar, and it doesn't seem feasible. Foo will just have to bar until we figure it out.\n\nFeel free to use [Google Search|http://www.google.com] to verify my research."})
  .reply(201, {"self":"https://virtru.atlassian.net/rest/api/2/issue/19935/comment/24665","id":"24665","author":{"self":"https://virtru.atlassian.net/rest/api/2/user?username=jordan","name":"jordan","key":"jordan","emailAddress":"jordan@virtru.com","avatarUrls":{"48x48":"https://virtru.atlassian.net/secure/useravatar?ownerId=jordan&avatarId=11700","24x24":"https://virtru.atlassian.net/secure/useravatar?size=small&ownerId=jordan&avatarId=11700","16x16":"https://virtru.atlassian.net/secure/useravatar?size=xsmall&ownerId=jordan&avatarId=11700","32x32":"https://virtru.atlassian.net/secure/useravatar?size=medium&ownerId=jordan&avatarId=11700"},"displayName":"Jordan Duggan","active":true,"timeZone":"America/New_York"},"body":"I took a look at bar, and it doesn't seem feasible. Foo will just have to bar until we figure it out.\n\nFeel free to use [Google Search|http://www.google.com] to verify my research.","updateAuthor":{"self":"https://virtru.atlassian.net/rest/api/2/user?username=jordan","name":"jordan","key":"jordan","emailAddress":"jordan@virtru.com","avatarUrls":{"48x48":"https://virtru.atlassian.net/secure/useravatar?ownerId=jordan&avatarId=11700","24x24":"https://virtru.atlassian.net/secure/useravatar?size=small&ownerId=jordan&avatarId=11700","16x16":"https://virtru.atlassian.net/secure/useravatar?size=xsmall&ownerId=jordan&avatarId=11700","32x32":"https://virtru.atlassian.net/secure/useravatar?size=medium&ownerId=jordan&avatarId=11700"},"displayName":"Jordan Duggan","active":true,"timeZone":"America/New_York"},"created":"2015-03-11T23:50:50.220-0400","updated":"2015-03-11T23:50:50.220-0400"}, { server: 'nginx',
  date: 'Thu, 12 Mar 2015 03:50:50 GMT',
  'content-type': 'application/json;charset=UTF-8',
  'transfer-encoding': 'chunked',
  connection: 'keep-alive',
  'x-arequestid': '1430x71863x1',
  'x-asen': 'SEN-2594513',
  'set-cookie': 
   [ 'JSESSIONID=DBA4A14ECA9F7FA18BB35B1BFA0A08E1; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=""; Domain=.virtru.atlassian.net; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=G3T95WK26iAXFrYAOU3bDg00; Domain=.virtru.atlassian.net; Path=/; Secure; HttpOnly',
     'atlassian.xsrf.token=BW7E-GFUY-04Z2-VPGF|97b4c260422e4f67df330ab1719b689db6f38194|lin; Path=/; Secure' ],
  'x-seraph-loginreason': 'OUT, OK',
  'x-asessionid': '2thh2w',
  'x-ausername': 'jordan',
  location: 'https://virtru.atlassian.net/rest/api/2/issue/19935/comment/24665',
  'cache-control': 'no-cache, no-store, no-transform',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=315360000;includeSubdomains' });
