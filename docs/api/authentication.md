## Authentication

### HMAC Auth Strategy

System uses HMAC signature to authenticate requests.

* System admin will provide appId and appSecret to consumer system through other channels

| Field | Meaning |
| -- | -- |
| appId | Application ID, e.g., "cookding" |
| appSecret | Secret, e.g., "8Am6UxWuFDfyMGKx" |

* Consumer system needs to generate timestamp and signature before each request 

| Field | Meaning |
| -- | -- |
| timestamp | Current timestamp，e.g., 2019-11-25T09:45:18.587Z |
| signature | Signature, calculates from HMAC_SHA256(appSecret, timestamp |

In JavaScript, HMAC_SHA256 can be implemented as
```javascript
function HMAC_SHA256(appSecret, timestamp) {
  return crypto
    .createHmac(
      "sha256",
      appSecret,
    )
    .update(timestamp)
    .digest('hex');
}
```

Then in the request HTTP Header, put the following fields

| Header Key | Meaning |
| -- | -- |
| X-Application-ID | Application ID, e.g., cookding |
| X-Timestamp | Timestamp, e.g., 2019-11-25T09:45:18.587Z |
| X-Signature | Signature, e.g., 708feae55f01e67ad3b4832b5de156d356ef545f9446e859c6da59efcc7568cd |

* If the application id does not exist, the authentication will fail.
* If the signature is generated from wrong secret, the authentication will fail.
* If the timestamp is far from current time, the authentication will fail.

If the authentication failed, the response will be
```
Status
  - 401 Unauthorized
Body
  - {
      "statusCode": 401,
      "message": "Unauthorized"
    }
```
