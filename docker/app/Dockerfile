FROM node:4.2

RUN mkdir /src
RUN npm install nodemon forever -g
RUN echo "Asia/Shanghai" | tee /etc/timezone && dpkg-reconfigure --frontend noninteractive tzdata
COPY ./app /src/app
CMD forever /src/app/server/server.js
