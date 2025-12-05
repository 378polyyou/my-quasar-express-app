// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
// โหลดตัวแปรสภาพแวดล้อมจากไฟล์ .env
require('dotenv').config();

const app = express();
// กำหนดพอร์ตจากตัวแปรสภาพแวดล้อม หรือใช้ 3000 เป็นค่าเริ่มต้น
const PORT = process.env.PORT || 3000;

// --- Middleware (ตัวกลาง) ---
// อนุญาต cross-origin เพื่อให้ frontend เข้าถึงได้
app.use(cors());
// อนุญาตให้ Express อ่าน JSON body จาก request
app.use(express.json());

// สร้างโฟลเดอร์ logs ถ้ายังไม่มี (สำหรับจำลองการใช้งาน Volume ใน Docker)
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    console.log(`สร้างไดเรกทอรี logs ที่: ${logsDir}`);
    fs.mkdirSync(logsDir);
}

// --- Endpoint Demo ---
// Endpoint demo: ส่งข้อมูล Git และ Docker และบันทึก request ลงใน logs
app.get('/api/demo', (req, res) => {
    // บันทึกข้อความลงใน access.log
    const logMessage = `Request at ${new Date().toISOString()}: IP ${req.ip}\n`;
    try {
        fs.appendFileSync(path.join(logsDir, 'access.log'), logMessage);
        console.log(`บันทึกการเข้าถึงแล้ว: ${req.ip}`);
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการบันทึกไฟล์ log:', error);
    }

    // ส่งข้อมูล demo กลับไป
    res.json({
        message: 'ข้อมูล Demo สำหรับการพัฒนา Full-Stack',
        student: { // <-- เพิ่ม Object นี้
            id: '6604101378',
            name: 'วีริศา',
            surname: 'เขียววรรณา'
        },
        git: {
            title: 'Advanced Git Workflow',
            detail: 'ใช้ branch protection บน GitHub, code review ใน PR, และ squash merge เพื่อ history ที่สะอาด'
        },
        docker: {
            title: 'Advanced Docker',
            detail: 'ใช้ multi-stage build, healthcheck ใน Dockerfile, และ orchestration ด้วย Compose/Swarm'
        }
    });
});

// --- การจัดการข้อผิดพลาด (Error handling) ---
app.use((err, req, res, next) => {
    console.error('--- เกิดข้อผิดพลาดใน Server ---');
    console.error(err.stack);
    res.status(500).send('มีบางอย่างผิดพลาด!');
});

// --- เริ่ม Server ---
app.listen(PORT, () => {
    console.log(`เซิร์ฟเวอร์กำลังทำงานบนพอร์ต ${PORT}`);
    console.log(`ทดสอบได้ที่: http://localhost:${PORT}/api/demo`);
});