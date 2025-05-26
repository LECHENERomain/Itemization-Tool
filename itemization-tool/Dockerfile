FROM node:24-alpine3.20 AS build
WORKDIR /app
COPY . .
RUN npm install -g @angular/cli && npm install
RUN ng build --configuration=production
RUN ls -la /app/dist/itemization-tool

FROM nginx:1.28-alpine AS nginx
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/itemization-tool /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
