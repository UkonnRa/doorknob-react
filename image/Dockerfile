FROM nginx:alpine

COPY build /usr/share/nginx/html

# new
COPY image/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
