FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/api
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*",".env", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 8101
RUN chown -R node /usr/src/api
USER node
CMD ["npm", "start"]
