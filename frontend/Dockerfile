# Stage 1: Build the Quasar (Vue) SPA
# เราใช้ node:20-slim เพราะ Quasar build ต้องการสภาพแวดล้อม Node.js
FROM node:20-slim AS builder

WORKDIR /app/frontend

# Copy package files first for caching dependencies
# *** [แก้ไข] ลบ "frontend/" ออกจาก Path ต้นทาง ***
COPY package.json package-lock.json ./ 
RUN npm ci

# Copy all project files (รวมถึง .env, quasar.config.*, src/)
# *** [แก้ไข] ลบ "frontend/" ออกจาก Path ต้นทาง ***
COPY . . 

# Build argument เพื่อรับค่า API URL จาก docker-compose
ARG VITE_API_URL="http://backend:3000"

# Build the Quasar application in production mode
# *** [แก้ไข] ส่งค่า Environment Variable VITE_API_URL เข้าไปในขั้นตอน Build ***
RUN VITE_API_URL=${VITE_API_URL} npm run build

# Stage 2: Serve the SPA with Nginx
# ใช้ Nginx Lightweight Image เพื่อ Serve Static Files
FROM nginx:alpine AS production

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration
# *** [แก้ไข] ลบ "frontend/" ออกจาก Path ต้นทาง ***
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built files from the builder stage
# Quasar จะ Build ไฟล์ไปที่ /app/frontend/dist/spa
COPY --from=builder /app/frontend/dist/spa /usr/share/nginx/html

# Expose the port Nginx is listening on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
