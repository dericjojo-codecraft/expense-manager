# --- STAGE 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install

# Copy source code and config
COPY . .

# Compile TypeScript to /dist
RUN npx tsc

# --- STAGE 2: Runtime ---
FROM node:20-alpine
WORKDIR /app

# Only copy what is strictly needed for production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install only production dependencies (no dev tools)
RUN npm install --omit=dev

# Ensure a data directory exists for the SQLite file
RUN mkdir -p /app/data

# Run the app
CMD ["node", "dist/index.js"]