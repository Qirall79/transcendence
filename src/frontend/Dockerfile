FROM node:18-alpine

WORKDIR /app

# Add the following to handle permission issues
RUN chown -R node:node /app

# Switch to non-root user
USER node

COPY --chown=node:node package*.json ./

RUN rm -rf dist

RUN npm install --no-cache

COPY --chown=node:node . .

RUN npm run build

EXPOSE 4173
# EXPOSE 5173

CMD ["npm", "run", "preview"]
# CMD ["npm", "run", "dev"]