const { PrismaClient } = require("@prisma/client");

// Singleton pattern to prevent multiple Prisma Client instances
// during development with hot-reloading
let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient();
  }
  prisma = global.__prisma;
}

module.exports = prisma;
