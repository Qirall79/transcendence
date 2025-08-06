FROM owasp/modsecurity-crs:nginx-alpine

USER root

RUN openssl req -x509 -newkey rsa:4096 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt -sha256 -days 365 \
-nodes -subj "/C=XX/ST=khouribga/L=khouribga/O=wbelfatm/OU=wbelfatm/CN=localhost"

# COPY ./ssl/keys/nginx-selfsigned.key /etc/ssl/private/nginx-selfsigned.key
# COPY ./ssl/certs/nginx-selfsigned.crt /etc/ssl/certs/nginx-selfsigned.crt