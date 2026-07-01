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

  console.log("✅ Default admin created:", `${admin.name} (${admin.mobile})`);

  // Seed 20 Staff members with Indian names
  const indianNames = [
    "Rahul Sharma", "Priya Patel", "Amit Singh", "Sneha Reddy",
    "Vikram Gupta", "Pooja Desai", "Rajeev Kumar", "Kavita Verma",
    "Sanjay Joshi", "Neha Iyer", "Arun Nair", "Anjali Menon",
    "Deepak Chawla", "Swati Mishra", "Karthik Krishnan", "Divya Kapoor",
    "Manoj Yadav", "Ritu Agarwal", "Suresh Babu", "Meera Das"
  ];

  console.log("\n🌱 Seeding 20 dummy staff members...");
  const staffIds = [];

  for (let i = 0; i < indianNames.length; i++) {
    const mobile = `900000${String(i + 1).padStart(4, "0")}`;
    
    const staff = await prisma.user.upsert({
      where: { mobile: mobile },
      update: {},
      create: {
        name: indianNames[i],
        mobile: mobile,
        role: "STAFF",
      },
    });
    staffIds.push(staff.id);
  }
  console.log(`✅ Successfully seeded 20 staff members!`);

  console.log("\n🌱 Seeding historical attendance records (last 7 days)...");
  
  // Clear existing attendance records to prevent duplicates during re-seeding
  await prisma.attendance.deleteMany({});
  
  let attendanceCount = 0;
  const today = new Date();
  
  for (const staffId of staffIds) {
    // Generate records for the past 7 days (excluding today, to allow manual check-in today)
    for (let i = 1; i <= 7; i++) {
      // 80% chance they were present on a given day
      if (Math.random() > 0.2) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Random check-in time between 8:00 AM and 10:30 AM
        const randomHour = 8 + Math.floor(Math.random() * 3);
        const randomMinute = Math.floor(Math.random() * 60);
        date.setHours(randomHour, randomMinute, 0, 0);

        // Format to YYYY-MM-DD
        const dateString = date.toISOString().split("T")[0];

        // Format to HH:MM:SS
        const timeString = `${String(randomHour).padStart(2, "0")}:${String(randomMinute).padStart(2, "0")}:00`;

        await prisma.attendance.create({
          data: {
            userId: staffId,
            date: dateString,
            checkInTime: timeString,
          },
        });
        attendanceCount++;
      }
    }
  }

  console.log(`✅ Successfully seeded ${attendanceCount} historical attendance records!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
