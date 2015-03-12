var nock = require('nock');

nock('https://virtru.atlassian.net:443')
  .post('/rest/api/2/issue/19935/comment', {"body":"This is the comment as a string."})
  .reply(201, {"self":"https://virtru.atlassian.net/rest/api/2/issue/19935/comment/24664","id":"24664","author":{"self":"https://virtru.atlassian.net/rest/api/2/user?username=jordan","name":"jordan","key":"jordan","emailAddress":"jordan@virtru.com","avatarUrls":{"48x48":"https://virtru.atlassian.net/secure/useravatar?ownerId=jordan&avatarId=11700","24x24":"https://virtru.atlassian.net/secure/useravatar?size=small&ownerId=jordan&avatarId=11700","16x16":"https://virtru.atlassian.net/secure/useravatar?size=xsmall&ownerId=jordan&avatarId=11700","32x32":"https://virtru.atlassian.net/secure/useravatar?size=medium&ownerId=jordan&avatarId=11700"},"displayName":"Jordan Duggan","active":true,"timeZone":"America/New_York"},"body":"This is the comment as a string.","updateAuthor":{"self":"https://virtru.atlassian.net/rest/api/2/user?username=jordan","name":"jordan","key":"jordan","emailAddress":"jordan@virtru.com","avatarUrls":{"48x48":"https://virtru.atlassian.net/secure/useravatar?ownerId=jordan&avatarId=11700","24x24":"https://virtru.atlassian.net/secure/useravatar?size=small&ownerId=jordan&avatarId=11700","16x16":"https://virtru.atlassian.net/secure/useravatar?size=xsmall&ownerId=jordan&avatarId=11700","32x32":"https://virtru.atlassian.net/secure/useravatar?size=medium&ownerId=jordan&avatarId=11700"},"displayName":"Jordan Duggan","active":true,"timeZone":"America/New_York"},"created":"2015-03-11T23:50:48.621-0400","updated":"2015-03-11T23:50:48.621-0400"}, { server: 'nginx',
  date: 'Thu, 12 Mar 2015 03:50:48 GMT',
  'content-type': 'application/json;charset=UTF-8',
  'transfer-encoding': 'chunked',
  connection: 'keep-alive',
  'x-arequestid': '1430x71862x1',
  'x-asen': 'SEN-2594513',
  'set-cookie': 
   [ 'JSESSIONID=50784866E2188C8918E6FC52583ABB1B; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=""; Domain=.virtru.atlassian.net; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=G3T95WK26iAXFrYAOU3bDg00; Domain=.virtru.atlassian.net; Path=/; Secure; HttpOnly',
     'atlassian.xsrf.token=BW7E-GFUY-04Z2-VPGF|8c4095760ad5975428e8cdc5c4d7632fb8764382|lin; Path=/; Secure' ],
  'x-seraph-loginreason': 'OUT, OK',
  'x-asessionid': 'v7e2fh',
  'x-ausername': 'jordan',
  location: 'https://virtru.atlassian.net/rest/api/2/issue/19935/comment/24664',
  'cache-control': 'no-cache, no-store, no-transform',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=315360000;includeSubdomains' });
