FROM node:20-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --chown=node:node app.js ./
COPY --chown=node:node test ./test

USER node

CMD ["npm", "start"]