const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@annasriyah.com";
  const username = process.env.SEED_ADMIN_USERNAME || "admin";
  const password = process.env.SEED_ADMIN_PASSWORD || "admin12345";
  const role = process.env.SEED_ADMIN_ROLE || "SUPERADMIN";

  const passwordHash = await hash(password, 12);

  const user = await prisma.adminUser.upsert({
    where: { username },
    update: {
      email,
      passwordHash,
      role,
    },
    create: {
      email,
      username,
      passwordHash,
      role,
    },
  });

  console.log(`Admin user seeded: ${user.username} <${user.email}>`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
