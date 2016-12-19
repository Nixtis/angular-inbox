FROM node:6.9.2-wheezy

WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm install
EXPOSE 8888

CMD ["npm", "run", "docker"]