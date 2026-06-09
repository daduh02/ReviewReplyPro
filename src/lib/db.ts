import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

let prisma: PrismaClient | null = null;

export function getDb() {
  if (!prisma) {
    if (process.env.TURSO_DATABASE_URL) {
      const adapter = new PrismaLibSQL({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });

      prisma = new PrismaClient({ adapter });
    } else {
      prisma = new PrismaClient();
    }
  }

  return prisma;
}
