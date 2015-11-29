FROM node:4.2

RUN mkdir /src
RUN npm install nodemon forever -g
RUN echo "Asia/Shanghai" | tee /etc/timezone && dpkg-reconfigure --frontend noninteractive tzdata
VOLUME ["/src"]
VOLUME ["/uploads"]
CMD tail -f /dev/null
