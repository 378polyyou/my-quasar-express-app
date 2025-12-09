#backend Dockerfile
# STAGE 1: Base Image
# ใช้ Node.js 20 LTS เวอร์ชั่นที่เบาที่สุดเพื่อลดขนาด Image
FROM node:20-slim

# กำหนด working directory ภายใน container
WORKDIR /app

# คัดลอก package.json และ package-lock.json (ถ้ามี) ก่อน
# เพื่อใช้ประโยชน์จาก Docker Layer Caching (ถ้า dependencies ไม่เปลี่ยน)
COPY package*.json ./

# ติดตั้ง dependencies ทั้งหมด
# --omit=dev ใช้เพื่อไม่ติดตั้ง dependencies ที่ใช้เฉพาะตอนพัฒนา (เช่น nodemon)
RUN npm install --omit=dev

RUN apt-get update && \
  apt-get install -y --no-install-recommends curl && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# คัดลอกไฟล์โค้ดทั้งหมดมา
# เราคัดลอกไฟล์โค้ดและ server.js (รวมถึง .env ที่อาจมีการตั้งค่า)
COPY . .

# กำหนด Environment Variables ที่จำเป็น
ENV PORT=3000

# เปิดพอร์ตที่ Express Server ทำงานอยู่
EXPOSE 3000

# กำหนด Healthcheck เพื่อให้ Docker Compose สามารถตรวจสอบความพร้อมของ API ได้
# ทดสอบโดยการเรียก endpoint /api/demo
HEALTHCHECK --interval=30s --timeout=20s --retries=10 \
  CMD curl -f http://localhost:3000/api/demo || exit 1

# คำสั่งเริ่มต้นเมื่อ Container รัน
# รัน main file ของ Express server
CMD [ "node", "service.js" ]