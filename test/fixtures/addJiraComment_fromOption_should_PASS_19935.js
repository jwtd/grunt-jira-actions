var nock = require('nock');

nock('https://virtru.atlassian.net:443')
  .post('/rest/api/2/issue/19935/comment', {"body":"This is the comment as a string."})
  .reply(201, {"self":"https://virtru.atlassian.net/rest/api/2/issue/19935/comment/24712","id":"24712","author":{"self":"https://virtru.atlassian.net/rest/api/2/user?username=jordan","name":"jordan","key":"jordan","emailAddress":"jordan@virtru.com","avatarUrls":{"48x48":"https://virtru.atlassian.net/secure/useravatar?ownerId=jordan&avatarId=11700","24x24":"https://virtru.atlassian.net/secure/useravatar?size=small&ownerId=jordan&avatarId=11700","16x16":"https://virtru.atlassian.net/secure/useravatar?size=xsmall&ownerId=jordan&avatarId=11700","32x32":"https://virtru.atlassian.net/secure/useravatar?size=medium&ownerId=jordan&avatarId=11700"},"displayName":"Jordan Duggan","active":true,"timeZone":"America/New_York"},"body":"This is the comment as a string.","updateAuthor":{"self":"https://virtru.atlassian.net/rest/api/2/user?username=jordan","name":"jordan","key":"jordan","emailAddress":"jordan@virtru.com","avatarUrls":{"48x48":"https://virtru.atlassian.net/secure/useravatar?ownerId=jordan&avatarId=11700","24x24":"https://virtru.atlassian.net/secure/useravatar?size=small&ownerId=jordan&avatarId=11700","16x16":"https://virtru.atlassian.net/secure/useravatar?size=xsmall&ownerId=jordan&avatarId=11700","32x32":"https://virtru.atlassian.net/secure/useravatar?size=medium&ownerId=jordan&avatarId=11700"},"displayName":"Jordan Duggan","active":true,"timeZone":"America/New_York"},"created":"2015-03-14T17:17:50.412-0400","updated":"2015-03-14T17:17:50.412-0400"}, { server: 'nginx',
  date: 'Sat, 14 Mar 2015 21:17:50 GMT',
  'content-type': 'application/json;charset=UTF-8',
  'transfer-encoding': 'chunked',
  connection: 'keep-alive',
  'x-arequestid': '1037x86067x1',
  'x-asen': 'SEN-2594513',
  'set-cookie': 
   [ 'JSESSIONID=1E0403078131310B086C521ECE00F051; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=""; Domain=.virtru.atlassian.net; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Path=/; Secure; HttpOnly',
     'studio.crowd.tokenkey=Hx42tJQAlX0iF4SEUlfR1w00; Domain=.virtru.atlassian.net; Path=/; Secure; HttpOnly',
     'atlassian.xsrf.token=BW7E-GFUY-04Z2-VPGF|6909cb316396a4652d4e5b9461bc8d2381e735b4|lin; Path=/; Secure' ],
  'x-seraph-loginreason': 'OUT, OK',
  'x-asessionid': 'bedzhg',
  'x-ausername': 'jordan',
  location: 'https://virtru.atlassian.net/rest/api/2/issue/19935/comment/24712',
  'cache-control': 'no-cache, no-store, no-transform',
  'x-content-type-options': 'nosniff',
  'strict-transport-security': 'max-age=315360000;includeSubdomains' });
