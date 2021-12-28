FROM node:alpine

RUN yarn global add nodemon

WORKDIR /usr/src/code

COPY package.json .

RUN yarn

COPY . .

CMD ["yarn", "start:dev", "-L"]