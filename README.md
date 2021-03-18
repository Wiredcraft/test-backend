
## Developers' Note
### Enable HTTPS in local

To [use HTTPS in local](https://web.dev/how-to-use-local-https/), make sure you've created `localhost.pem` and `localhost-key.pem` in the project root directory:

```sh
brew install mkcert
mkcert -install
mkcert localhost
```

Then you can access https://localhost:3000/ instead of http://localhost:3000/.
