const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create default admin
  const hashedPassword = await bcrypt.hash("1234", 10);

  const admin = await prisma.user.upsert({
    where: { mobile: "9999999999" },
    update: {},
    create: {
      name: "VegPro Admin",
      mobile: "9999999999",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`✅ Default admin created: ${admin.name} (${admin.mobile})`);
  console.log("   Password: 1234");
  console.log("");
  console.log("⚠️  Please change the default password after first login!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
