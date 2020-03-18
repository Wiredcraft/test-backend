# Design Documents

## Background

This backend service is a general user management service that is open source and can be privately deployed.

It provides the capabilities of managing users so that other systems can use it to simplify their business. 

## Features 

1. Other system can get/create/update/delete user data. 

## Architecture design decisions

1. Use a progressive framework (e.g., nestjs) so that we can keep it simple for current requirements, and grow progressively to meet future requrements.

2. Decompose the system into modules. Use modules to separate different domains such as config, users, auth, each module should keep exports simple and reliable.

3. Decompose the modules into layers. Service layer should encapsulate business logic. Controller layer should be thin.

4. Use BDD style tests. A unit in this system corresponds to a layer or a layer of a module in unit test. Test should cover service layer and api layer.

## Authentication design decisions

1. Use application ID and secret to authenticate consumer system.

2. Ideally, properly configured HTTPS with forward security can protect the secret from leaks (e.g., mailgun's send email API). But with less requirements, the system can support more kinds of consumer systems. The authentication choice will be based on the following requirements:
    1. The API will be protected with HTTPS
    2. Forward security may not be enabled in HTTPS

3. The consumer system can send the signature generated from secret and timestamp, so that the secret will not leak even when HTTPS traffic is decrypted in the future, and the decrypted information will not pass authentication in the future since the timestamp is expired.

4. Use HMAC auth strategy inspired by mailgun and AWS S3.
