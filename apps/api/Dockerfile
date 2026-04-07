FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src

RUN npm run build && npm prune --omit=dev

FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3333

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist

EXPOSE 3333

CMD ["npm", "run", "start"]
