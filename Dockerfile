FROM node:12
WORKDIR /scraper-project/bot-api
ADD package.json /package.json
RUN npm install && npm build
ADD . /scraper-project/bot-api

EXPOSE 3001

CMD ["npm","run","start"]

