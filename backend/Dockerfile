# Stage 1: Build stage
FROM node:20-slim AS builder

# ติดตั้ง OpenSSL เพราะ Prisma ต้องการใช้ในการสื่อสารกับฐานข้อมูล
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app/backend

# Copy package files เพื่อใช้ประโยชน์จาก Docker Layer Cache
COPY package.json package-lock.json ./
RUN npm ci

# Copy โฟลเดอร์ prisma (ซึ่งบรรจุ schema.prisma)
COPY prisma ./prisma/

# *** ใช้ Dummy DATABASE_URL เพื่อให้ prisma generate ผ่านขั้นตอน build ได้โดยไม่ต้องใช้ .env จริง ***
RUN DATABASE_URL="postgresql://dummyuser:dummypass@localhost:5432/dummydb" npx prisma generate

# Copy source code ทั้งหมดเพื่อเตรียม Build (Compile TS เป็น JS)
COPY . .
RUN npm run build

# Stage 2: Run stage (Production Image)
FROM node:20-slim AS production

# ติดตั้ง OpenSSL ใน Stage สำหรับรันจริง (Runtime)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy เฉพาะไฟล์ที่จำเป็นสำหรับการรันจาก builder stage เพื่อลดขนาด Image
COPY --from=builder /app/backend/package*.json ./
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/prisma ./prisma

# กำหนดตัวแปรสภาพแวดล้อมพื้นฐานสำหรับ Production
ENV NODE_ENV=production
ENV PORT=3000

# เปิด Port 3000 สำหรับการเชื่อมต่อ
EXPOSE 3000

# รัน Server โดยเรียกใช้ไฟล์ที่คอมไพล์แล้วใน dist/server.js
# ตอนรันจริง ระบบจะดึง DATABASE_URL จาก docker-compose.yml หรือไฟล์ .env บนเครื่อง
CMD ["node", "dist/server.js"]