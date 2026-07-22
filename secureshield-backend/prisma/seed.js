import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with requested custom customer names...");

  // 1. Create Admin Account - Suruthi
  const adminEmail = "suruthi@secureshield.test";
  const adminHashedPassword = await bcrypt.hash("Admin@123", 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: "Suruthi", password: adminHashedPassword, role: "ADMIN" },
    create: { name: "Suruthi", email: adminEmail, password: adminHashedPassword, role: "ADMIN" },
  });

  // 2. Create Agent Account - Gokul
  const agentEmail = "gokul@secureshield.test";
  const agentHashedPassword = await bcrypt.hash("Agent@123", 10);
  await prisma.user.upsert({
    where: { email: agentEmail },
    update: { name: "Gokul", password: agentHashedPassword, role: "AGENT" },
    create: { name: "Gokul", email: agentEmail, password: agentHashedPassword, role: "AGENT" },
  });

  // 3. Create Custom Customers
  const customerHashedPassword = await bcrypt.hash("Customer@123", 10);

  const customerData = [
    { name: "Samreena", email: "samreena@example.com", dob: new Date("1995-08-22"), phone: "+1 555-0188", address: "45 Palm Avenue, Grand Boulevard" },
    { name: "Suvetha", email: "suvetha@example.com", dob: new Date("1994-06-14"), phone: "+1 555-0199", address: "12 Jasmine Gardens, Chennai" },
    { name: "Neka", email: "neka@example.com", dob: new Date("1996-03-25"), phone: "+1 555-0200", address: "78 Pearl Street, Coimbatore" },
    { name: "Princy", email: "princy@example.com", dob: new Date("1993-11-12"), phone: "+1 555-0210", address: "204 Lotus Avenue, Madurai" },
    { name: "Raje", email: "raje@example.com", dob: new Date("1990-09-08"), phone: "+1 555-0220", address: "56 Royal Towers, Salem" },
    { name: "Tamilselvan", email: "tamilselvan@example.com", dob: new Date("1978-01-30"), phone: "+1 555-0230", address: "101 Grand Trunk Rd, Trichy" },
    { name: "Kumaran", email: "kumaran@example.com", dob: new Date("1989-05-18"), phone: "+1 555-0240", address: "33 Heritage Park, Erode" },
    { name: "Nithiya", email: "nithiya@example.com", dob: new Date("1992-07-04"), phone: "+1 555-0250", address: "89 Lake View, Tirunelveli" },
    { name: "John Doe", email: "john.doe@example.com", dob: new Date("1988-05-15"), phone: "+1 555-0192", address: "742 Evergreen Terrace, Springfield" },
    { name: "Sarah Smith", email: "sarah.smith@example.com", dob: new Date("1992-11-20"), phone: "+1 555-0148", address: "104 Ocean Drive, Miami, FL" },
    { name: "Michael Chen", email: "michael.chen@example.com", dob: new Date("1985-03-10"), phone: "+1 555-0177", address: "88 Silicon Way, San Jose, CA" },
    { name: "Priya Sharma", email: "priya.sharma@example.com", dob: new Date("1990-09-04"), phone: "+1 555-0123", address: "12 Maple Street, Boston, MA" },
    { name: "David Miller", email: "david.miller@example.com", dob: new Date("1979-12-01"), phone: "+1 555-0166", address: "55 Pine Ridge Rd, Austin, TX" },
    { name: "Emily Davis", email: "emily.davis@example.com", dob: new Date("1994-04-18"), phone: "+1 555-0155", address: "202 Sunset Blvd, Los Angeles, CA" },
    { name: "Alex Taylor", email: "alex.taylor@example.com", dob: new Date("1997-07-29"), phone: "+1 555-0133", address: "310 Broad St, Philadelphia, PA" },
  ];

  const createdCustomers = [];
  for (const c of customerData) {
    const cust = await prisma.customer.upsert({
      where: { email: c.email },
      update: { name: c.name, dob: c.dob, phone: c.phone, address: c.address },
      create: { ...c, password: customerHashedPassword },
    });
    createdCustomers.push(cust);
  }

  // 4. Create Policies across Customers
  const policyData = [
    { customerId: createdCustomers[0].id, policyType: "Health Insurance", policyNumber: "POL-HEALTH-5001", premiumAmount: 320.0, startDate: new Date("2026-01-01"), endDate: new Date("2027-01-01"), status: "ACTIVE" },
    { customerId: createdCustomers[1].id, policyType: "Auto Insurance", policyNumber: "POL-AUTO-6001", premiumAmount: 210.0, startDate: new Date("2026-02-01"), endDate: new Date("2027-02-01"), status: "ACTIVE" },
    { customerId: createdCustomers[2].id, policyType: "Health Insurance", policyNumber: "POL-HEALTH-6002", premiumAmount: 350.0, startDate: new Date("2025-09-01"), endDate: new Date("2026-09-01"), status: "ACTIVE" },
    { customerId: createdCustomers[3].id, policyType: "Life Insurance", policyNumber: "POL-LIFE-6003", premiumAmount: 580.0, startDate: new Date("2026-03-01"), endDate: new Date("2027-03-01"), status: "ACTIVE" },
    { customerId: createdCustomers[4].id, policyType: "Home Insurance", policyNumber: "POL-HOME-6004", premiumAmount: 430.0, startDate: new Date("2025-05-01"), endDate: new Date("2026-05-01"), status: "EXPIRED" },
    { customerId: createdCustomers[5].id, policyType: "Life Insurance", policyNumber: "POL-LIFE-6005", premiumAmount: 720.0, startDate: new Date("2026-01-15"), endDate: new Date("2027-01-15"), status: "ACTIVE" },
    { customerId: createdCustomers[6].id, policyType: "Auto Insurance", policyNumber: "POL-AUTO-6006", premiumAmount: 240.0, startDate: new Date("2025-11-01"), endDate: new Date("2026-11-01"), status: "ACTIVE" },
    { customerId: createdCustomers[7].id, policyType: "Health Insurance", policyNumber: "POL-HEALTH-6007", premiumAmount: 290.0, startDate: new Date("2026-04-01"), endDate: new Date("2027-04-01"), status: "ACTIVE" },
    { customerId: createdCustomers[8].id, policyType: "Health Insurance", policyNumber: "POL-HEALTH-1001", premiumAmount: 250.0, startDate: new Date("2026-01-01"), endDate: new Date("2027-01-01"), status: "ACTIVE" },
    { customerId: createdCustomers[9].id, policyType: "Home Insurance", policyNumber: "POL-HOME-2001", premiumAmount: 410.0, startDate: new Date("2025-01-01"), endDate: new Date("2026-01-01"), status: "EXPIRED" },
    { customerId: createdCustomers[10].id, policyType: "Auto Insurance", policyNumber: "POL-AUTO-3001", premiumAmount: 210.0, startDate: new Date("2025-11-01"), endDate: new Date("2026-11-01"), status: "ACTIVE" },
    { customerId: createdCustomers[11].id, policyType: "Life Insurance", policyNumber: "POL-LIFE-4001", premiumAmount: 600.0, startDate: new Date("2026-03-15"), endDate: new Date("2027-03-15"), status: "ACTIVE" },
    { customerId: createdCustomers[12].id, policyType: "Home Insurance", policyNumber: "POL-HOME-5003", premiumAmount: 450.0, startDate: new Date("2025-07-01"), endDate: new Date("2026-07-01"), status: "ACTIVE" },
    { customerId: createdCustomers[13].id, policyType: "Health Insurance", policyNumber: "POL-HEALTH-6008", premiumAmount: 310.0, startDate: new Date("2025-09-01"), endDate: new Date("2026-09-01"), status: "ACTIVE" },
    { customerId: createdCustomers[14].id, policyType: "Auto Insurance", policyNumber: "POL-AUTO-7001", premiumAmount: 175.0, startDate: new Date("2024-05-01"), endDate: new Date("2025-05-01"), status: "CANCELLED" },
  ];

  const createdPolicies = [];
  for (const p of policyData) {
    const pol = await prisma.policy.upsert({
      where: { policyNumber: p.policyNumber },
      update: { status: p.status, premiumAmount: p.premiumAmount },
      create: p,
    });
    createdPolicies.push(pol);
  }

  // 5. Create Claims
  await prisma.claim.deleteMany();
  const claimData = [
    { policyId: createdPolicies[0].id, claimAmount: 1250.00, reason: "Specialist consultation & hospital scans", status: "PENDING", submissionDate: new Date("2026-07-10") },
    { policyId: createdPolicies[1].id, claimAmount: 550.00, reason: "Bumper accident repair", status: "APPROVED", submissionDate: new Date("2026-06-18") },
    { policyId: createdPolicies[2].id, claimAmount: 1800.00, reason: "Inpatient medical treatment & prescription", status: "APPROVED", submissionDate: new Date("2026-05-22") },
    { policyId: createdPolicies[3].id, claimAmount: 4500.00, reason: "Critical care medical claim", status: "PENDING", submissionDate: new Date("2026-07-15") },
    { policyId: createdPolicies[4].id, claimAmount: 2800.00, reason: "Roof leak storm damage restoration", status: "REJECTED", submissionDate: new Date("2025-12-05") },
    { policyId: createdPolicies[5].id, claimAmount: 3200.00, reason: "Hospitalization coverage claim", status: "APPROVED", submissionDate: new Date("2026-04-10") },
    { policyId: createdPolicies[6].id, claimAmount: 420.00, reason: "Windshield crack replacement", status: "APPROVED", submissionDate: new Date("2026-06-05") },
    { policyId: createdPolicies[7].id, claimAmount: 950.00, reason: "Emergency medical checkup & lab tests", status: "PENDING", submissionDate: new Date("2026-07-20") },
    { policyId: createdPolicies[8].id, claimAmount: 2100.00, reason: "Surgery procedure claim", status: "APPROVED", submissionDate: new Date("2026-05-20") },
    { policyId: createdPolicies[10].id, claimAmount: 890.00, reason: "Side door repair from scrape", status: "PENDING", submissionDate: new Date("2026-07-18") },
  ];

  await prisma.claim.createMany({ data: claimData });

  // 6. Create Premium Payments
  await prisma.premiumPayment.deleteMany();
  const premiumData = [
    { policyId: createdPolicies[0].id, amount: 320.0, paymentStatus: "PAID", paymentDate: new Date("2026-01-05") },
    { policyId: createdPolicies[1].id, amount: 210.0, paymentStatus: "PAID", paymentDate: new Date("2026-02-05") },
    { policyId: createdPolicies[2].id, amount: 350.0, paymentStatus: "PAID", paymentDate: new Date("2025-09-10") },
    { policyId: createdPolicies[3].id, amount: 580.0, paymentStatus: "PAID", paymentDate: new Date("2026-03-05") },
    { policyId: createdPolicies[4].id, amount: 430.0, paymentStatus: "OVERDUE", paymentDate: new Date("2025-11-01") },
    { policyId: createdPolicies[5].id, amount: 720.0, paymentStatus: "PAID", paymentDate: new Date("2026-01-20") },
    { policyId: createdPolicies[6].id, amount: 240.0, paymentStatus: "OVERDUE", paymentDate: new Date("2026-06-01") },
    { policyId: createdPolicies[7].id, amount: 290.0, paymentStatus: "PAID", paymentDate: new Date("2026-04-10") },
    { policyId: createdPolicies[8].id, amount: 250.0, paymentStatus: "PAID", paymentDate: new Date("2026-01-05") },
    { policyId: createdPolicies[9].id, amount: 410.0, paymentStatus: "OVERDUE", paymentDate: new Date("2025-12-01") },
    { policyId: createdPolicies[10].id, amount: 210.0, paymentStatus: "PAID", paymentDate: new Date("2025-11-10") },
    { policyId: createdPolicies[11].id, amount: 600.0, paymentStatus: "PAID", paymentDate: new Date("2026-03-20") },
  ];

  await prisma.premiumPayment.createMany({ data: premiumData });

  // 7. Create Sample Documents
  await prisma.document.deleteMany();
  await prisma.document.createMany({
    data: [
      { customerId: createdCustomers[0].id, fileName: "samreena_passport_id.pdf", filePath: "uploads/samreena-passport.pdf" },
      { customerId: createdCustomers[1].id, fileName: "suvetha_identity_card.pdf", filePath: "uploads/suvetha-id.pdf" },
      { customerId: createdCustomers[2].id, fileName: "neka_health_declaration.pdf", filePath: "uploads/neka-health.pdf" },
      { customerId: createdCustomers[3].id, fileName: "princy_life_policy_doc.pdf", filePath: "uploads/princy-doc.pdf" },
      { customerId: createdCustomers[4].id, fileName: "raje_house_deed.pdf", filePath: "uploads/raje-deed.pdf" },
      { customerId: createdCustomers[5].id, fileName: "tamilselvan_pan_card.pdf", filePath: "uploads/tamilselvan-pan.pdf" },
      { customerId: createdCustomers[6].id, fileName: "kumaran_rc_book.pdf", filePath: "uploads/kumaran-rc.pdf" },
      { customerId: createdCustomers[7].id, fileName: "nithiya_medical_report.pdf", filePath: "uploads/nithiya-report.pdf" },
    ],
  });

  console.log("\nDatabase seeded with custom customer names!");
  console.log("Stats:");
  console.log(`  Customers: ${customerData.length}`);
  console.log(`  Policies:  ${policyData.length}`);
  console.log(`  Claims:    ${claimData.length}`);
  console.log(`  Premiums:  ${premiumData.length}`);
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
