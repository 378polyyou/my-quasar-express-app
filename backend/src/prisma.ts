import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// ดึง DATABASE_URL จาก environment variable (ที่ส่งมาจาก Docker Compose)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ CRITICAL ERROR: DATABASE_URL is not defined in environment variables.");
  throw new Error("DATABASE_URL must be provided via environment variables.");
}

// ตั้งค่า Pool สำหรับการเชื่อมต่อ Postgres
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// ใช้ Singleton pattern เพื่อป้องกันการสร้าง connection ซ้อนกันมากเกินไป
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;