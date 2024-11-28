FROM node:latest AS build
WORKDIR /app
COPY package.json yarn.lock /app/
RUN node -v && yarn -v
RUN yarn install --frozen-lockfile
COPY app /app
RUN yarn build
FROM nginx:latest
COPY config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
