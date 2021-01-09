FROM node:alpine

RUN mkdir -p /web

COPY . /web

WORKDIR /web

RUN npm config set registry https://registry.npm.taobao.org

RUN npm install --save nuxt@2.11.0

RUN npm install

RUN npm run build

ENV HOST 0.0.0.0
ENV PORT 8000

EXPOSE 8000

CMD ["npm", "start"]