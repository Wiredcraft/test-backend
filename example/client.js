const axios = require('axios').default;
const crypto = require('crypto');

const baseAddr = process.env.BASE_ADDR || 'http://localhost:3000';
const appId = process.env.AUTH_APP_ID || 'cookding';
const appSecret = process.env.AUTH_APP_SECRET || 'should_change_in_prod';
const hmacAlgorithm = process.env.AUTH_HMAC_ALGORITHM || 'sha256';

const main = async () => {
  const timestamp = new Date().toISOString();
  const signature = crypto.createHmac(hmacAlgorithm, appSecret).update(timestamp).digest('hex');

  let res;
  res = await axios({
    method: 'post',
    url: `${baseAddr}/users`,
    data: {
      id: new Date().getTime().toString(),
      description: new Date().toISOString()
    },
    headers: {
      'X-Application-ID': appId,
      'X-Timestamp': timestamp,
      'X-Signature': signature
    }
  });
  console.log(new Date, 'create user', { status: res.status, body: JSON.stringify(res.data) });

  res = await axios({
    method: 'get',
    url: `${baseAddr}/users?offset=0&limit=2`,
    headers: {
      'X-Application-ID': appId,
      'X-Timestamp': timestamp,
      'X-Signature': signature
    }
  });
  console.log(new Date, 'list users', { status: res.status, body: JSON.stringify(res.data) });
};

main();
