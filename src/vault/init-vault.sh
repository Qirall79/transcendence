#!/bin/sh

vault server -dev &
VAULT_PID=$!


while ! nc -z vault 8200; do
  sleep 1
done

echo hi

vault secrets enable -version=2 -path=transcendence kv
 
vault policy write transcendence - << EOF
path "kv/data/transcendence/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}
EOF

vault kv put transcendence/42-client-id client_id=$FORTY_TWO_CLIENT_ID
vault kv put transcendence/42-client-secret client_secret=$FORTY_TWO_CLIENT_SECRET
vault kv put transcendence/google-client-id client_id=$GOOGLE_CLIENT_ID
vault kv put transcendence/google-client-secret client_secret=$GOOGLE_CLIENT_SECRET
vault kv put transcendence/cloudinary-name cloudinary_name=$VITE_CLOUDINARY_NAME
vault kv put transcendence/cloudinary-api-key cloudinary_api_key=$VITE_CLOUDINARY_API_KEY
vault kv put transcendence/cloudinary-api-secret cloudinary_api_secret=$VITE_CLOUDINARY_API_SECRET

wait $VAULT_PID