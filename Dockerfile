FROM okteto/node:14 as dev
WORKDIR /usr/src/app
COPY package.json ./
RUN yarn install 

FROM dev as build
COPY . .
RUN yarn build

FROM bitnami/nginx as prod
COPY --from=build /usr/src/app/build /app