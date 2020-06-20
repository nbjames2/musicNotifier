FROM node:10.21-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm i -g sequelize-cli@5.4.0
RUN npm install --production --silent && mv node_modules ../
COPY . .

CMD [ "npm", "start" ]