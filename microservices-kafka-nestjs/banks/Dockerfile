FROM node:19-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

CMD ["npm", "run", "start"]