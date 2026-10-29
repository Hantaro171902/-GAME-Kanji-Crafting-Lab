#!/bin/sh
set -e
if [ -f /certs/gitgw.pem ]; then
  cat /etc/ssl/certs/ca-certificates.crt /certs/gitgw.pem > /etc/ssl/certs/ca-bundle.merged.crt
  export SSL_CERT_FILE=/etc/ssl/certs/ca-bundle.merged.crt
  export NODE_EXTRA_CA_CERTS=${NODE_EXTRA_CA_CERTS:-/certs/gitgw.pem}
fi
exec wrangler "$@"