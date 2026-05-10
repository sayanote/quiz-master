# Stage 1: Build
FROM node:24-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
# tsc doesn't copy static files, so we do it manually
# Copy index.html and all audio files to dist
RUN cp src/index.html dist/ && \
    cp src/*.mp3 dist/

# Stage 2: Production
FROM node:24-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 4444

CMD ["npm", "start"]

