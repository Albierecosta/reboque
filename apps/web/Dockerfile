FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.27-alpine AS runtime

ENV PORT=8080
ENV VITE_API_URL=http://localhost:3333/api

COPY nginx.default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["/bin/sh", "-c", "envsubst '$VITE_API_URL' < /usr/share/nginx/html/runtime-config.template.json > /usr/share/nginx/html/runtime-config.json && exec nginx -g 'daemon off;'"]
