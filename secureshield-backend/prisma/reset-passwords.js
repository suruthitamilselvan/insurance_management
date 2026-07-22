import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Resetting all account passwords cleanly...");

  const adminHash = await bcrypt.hash("Admin@123", 10);
  const agentHash = await bcrypt.hash("Agent@123", 10);
  const customerHash = await bcrypt.hash("Customer@123", 10);

  // Update Suruthi (Admin)
  await prisma.user.updateMany({
    where: { email: "suruthi@secureshield.test" },
    data: { password: adminHash, role: "ADMIN" },
  });
  console.log("Updated Suruthi password to Admin@123");

  // Update Gokul (Agent)
  await prisma.user.updateMany({
    where: { email: "gokul@secureshield.test" },
    data: { password: agentHash, role: "AGENT" },
  });
  console.log("Updated Gokul password to Agent@123");

  // Update Samreena (Customer)
  await prisma.customer.updateMany({
    where: { email: "samreena@example.com" },
    data: { password: customerHash },
  });
  console.log("Updated Samreena password to Customer@123");

  // Also update default fallback admin/agent if present
  await prisma.user.updateMany({
    where: { email: "admin@secureshield.test" },
    data: { password: adminHash },
  });
  await prisma.user.updateMany({
    where: { email: "agent@secureshield.test" },
    data: { password: agentHash },
  });

  // Verify Suruthi password comparison
  const suruthi = await prisma.user.findUnique({ where: { email: "suruthi@secureshield.test" } });
  const isSuruthiValid = await bcrypt.compare("Admin@123", suruthi.password);
  console.log("Verification test for Suruthi Admin@123:", isSuruthiValid ? "SUCCESS ✅" : "FAILED ❌");

  // Verify Gokul password comparison
  const gokul = await prisma.user.findUnique({ where: { email: "gokul@secureshield.test" } });
  const isGokulValid = await bcrypt.compare("Agent@123", gokul.password);
  console.log("Verification test for Gokul Agent@123:", isGokulValid ? "SUCCESS ✅" : "FAILED ❌");

  // Verify Samreena password comparison
  const samreena = await prisma.customer.findUnique({ where: { email: "samreena@example.com" } });
  const isSamreenaValid = await bcrypt.compare("Customer@123", samreena.password);
  console.log("Verification test for Samreena Customer@123:", isSamreenaValid ? "SUCCESS ✅" : "FAILED ❌");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
