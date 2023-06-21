FROM node:12
WORKDIR /usr/app

COPY . /usr/app/
RUN npm install && npm run build

EXPOSE 3001

CMD ["node", "dist/main.js"]

