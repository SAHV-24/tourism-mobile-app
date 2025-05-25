FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g @ionic/cli && npm install

COPY . .

EXPOSE 8100

ENV NODE_ENV=development

CMD ["ionic", "serve", "--host=0.0.0.0", "--port=8100", "--disable-host-check"]
