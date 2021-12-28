FROM node:alpine

# optional
RUN yarn global add nodemon

WORKDIR /usr/src/code

COPY package.json .

COPY . .

# EXPOSE 3000

CMD ["yarn", "start:dev", "-L"]