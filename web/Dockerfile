FROM nginx:stable-alpine

COPY ./dist/speedrun1st /usr/share/nginx/html/
COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]