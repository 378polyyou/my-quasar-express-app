# -------------------------------------------------------
# Stage 1: Build Quasar SPA
# -------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build Quasar (SPA)
RUN npm run build

# -------------------------------------------------------
# Stage 2: Nginx to serve static files
# -------------------------------------------------------
FROM nginx:1.27-alpine

# Copy built files from builder
COPY --from=builder /app/dist/spa /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
