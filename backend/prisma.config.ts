import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
// เพิ่ม dotenv เพื่อรองรับทั้งการรันผ่าน Docker และ Native PC
import 'dotenv/config';

// ตรวจสอบค่า DATABASE_URL จากหลายแหล่ง (Environment หรือ .env)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // พิมพ์ Log เพื่อช่วย Debug ว่า Node.js มองเห็น Environment อะไรบ้าง
  console.error("❌ CRITICAL ERROR: DATABASE_URL is missing.");
  console.log("Environment Keys found:", Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('PORT')));
  throw new Error("DATABASE_URL must be provided via environment variables.");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;