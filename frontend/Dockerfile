#frontend Dockerfile
# STAGE 1: BUILD STAGE
# ใช้ Node.js 20 เพื่อติดตั้ง dependencies และ Build โค้ด
FROM node:20 as builder

# กำหนด working directory ภายใน container
WORKDIR /app

# คัดลอกไฟล์ Build config และ dependencies
COPY package*.json .
COPY quasar.config.js .
COPY .env .

RUN npm install -g @quasar/cli

# ติดตั้ง dependencies
# --force เพื่อหลีกเลี่ยงข้อผิดพลาดหากมีการเปลี่ยนเวอร์ชัน Vue/Quasar
RUN npm install --force

# คัดลอกไฟล์ source code ของ Quasar ทั้งหมด
COPY . .

# Build Quasar App ในโหมด SPA (Single Page Application)
# Quasar CLI จะสร้างไฟล์ final output ในโฟลเดอร์ dist/spa
RUN quasar build -m spa

# -------------------------------------------------------------
# STAGE 2: PRODUCTION STAGE (Serve ด้วย NGINX)
# ใช้ NGINX Alpine Image ที่มีขนาดเล็กที่สุดเพื่อรัน Static Files
FROM nginx:alpine as production

# ลบไฟล์ default config ของ NGINX
RUN rm /etc/nginx/conf.d/default.conf

# คัดลอกไฟล์ config NGINX ที่กำหนดเอง เพื่อรองรับ SPA routing
# ไฟล์ nginx.conf นี้จะต้องถูกสร้างไว้ในโฟลเดอร์ frontend/
# (ถ้าไม่มีไฟล์นี้ NGINX จะใช้ default และอาจมีปัญหากับ Vue Router history mode)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# คัดลอกผลลัพธ์การ Build จาก STAGE 1 (builder) มาใส่ใน NGINX Web Root
# NGINX จะทำหน้าที่เป็น Web Server สำหรับไฟล์ SPA เหล่านี้
COPY --from=builder /app/dist/spa /usr/share/nginx/html

# เปิดพอร์ตมาตรฐานของ Web Server
EXPOSE 80

# คำสั่งเริ่มต้น NGINX (Default CMD ของ NGINX)
CMD ["nginx", "-g", "daemon off;"]
