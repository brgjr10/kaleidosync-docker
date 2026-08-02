FROM node:20-bullseye AS builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production
ENV VITE_API=/

RUN node node_modules/vite/bin/vite.js build


FROM nginx:1.31.3-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
