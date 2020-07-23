FROM node:alpine

RUN mkdir -p /server

COPY . /server

WORKDIR /server

RUN npm config set registry https://registry.npm.taobao.org

RUN npm install

ENV HOST 0.0.0.0
ENV PORT 3000

EXPOSE 3000

ENTRYPOINT ["npm", "run"]
CMD ["serve"]