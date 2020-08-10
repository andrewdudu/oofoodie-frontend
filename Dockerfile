FROM node:lts-alpine

WORKDIR /home/app
COPY . .

# install simple http server for serving static content
RUN npm install -g http-server


# install project dependencies
RUN npm install

# build app for production with minification
RUN npm run build

EXPOSE 3000
CMD [ "http-server", "dist" ]