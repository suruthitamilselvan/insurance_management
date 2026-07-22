import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with expanded 15+ customer enterprise dataset...");

  // 1. Create Admin Account - Suruthi
  const adminEmail = "suruthi@secureshield.test";
  const adminHashedPassword = await bcrypt.hash("Admin@123", 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: "Suruthi", password: adminHashedPassword, role: "ADMIN" },
    create: { name: "Suruthi", email: adminEmail, password: adminHashedPassword, role: "ADMIN" },
  });

  // 2. Create Agent Account - Gokul
  const agentEmail = "gokul@secureshield.test";
  const agentHashedPassword = await bcrypt.hash("Agent@123", 10);
  const agent = await prisma.user.upsert({
    where: { email: agentEmail },
    update: { name: "Gokul", password: agentHashedPassword, role: "AGENT" },
    create: { name: "Gokul", email: agentEmail, password: agentHashedPassword, role: "AGENT" },
  });

  // Additional Agents
  const agent2HashedPassword = await bcrypt.hash("Agent@123", 10);
  await prisma.user.upsert({
    where: { email: "agent.rachel@secureshield.test" },
    update: { name: "Rachel Green", password: agent2HashedPassword, role: "AGENT" },
    create: { name: "Rachel Green", email: "agent.rachel@secureshield.test", password: agent2HashedPassword, role: "AGENT" },
  });

  // 3. Create 15 Customer Accounts
  const customerHashedPassword = await bcrypt.hash("Customer@123", 10);

  const customerData = [
    { name: "Samreena", email: "samreena@example.com", dob: new Date("1995-08-22"), phone: "+1 555-0188", address: "45 Palm Avenue, Grand Boulevard" },
    { name: "John Doe", email: "john.doe@example.com", dob: new Date("1988-05-15"), phone: "+1 555-0192", address: "742 Evergreen Terrace, Springfield" },
    { name: "Sarah Smith", email: "sarah.smith@example.com", dob: new Date("1992-11-20"), phone: "+1 555-0148", address: "104 Ocean Drive, Miami, FL" },
    { name: "Michael Chen", email: "michael.chen@example.com", dob: new Date("1985-03-10"), phone: "+1 555-0177", address: "88 Silicon Way, San Jose, CA" },
    { name: "Priya Sharma", email: "priya.sharma@example.com", dob: new Date("1990-09-04"), phone: "+1 555-0123", address: "12 Maple Street, Boston, MA" },
    { name: "David Miller", email: "david.miller@example.com", dob: new Date("1979-12-01"), phone: "+1 555-0166", address: "55 Pine Ridge Rd, Austin, TX" },
    { name: "Emily Davis", email: "emily.davis@example.com", dob: new Date("1994-04-18"), phone: "+1 555-0155", address: "202 Sunset Blvd, Los Angeles, CA" },
    { name: "Alex Taylor", email: "alex.taylor@example.com", dob: new Date("1997-07-29"), phone: "+1 555-0133", address: "310 Broad St, Philadelphia, PA" },
    { name: "Robert Wilson", email: "robert.wilson@example.com", dob: new Date("1983-06-12"), phone: "+1 555-0211", address: "412 Oak Lane, Chicago, IL" },
    { name: "Jessica Martinez", email: "jessica.m@example.com", dob: new Date("1991-02-28"), phone: "+1 555-0222", address: "789 Rosewood Dr, Seattle, WA" },
    { name: "Daniel Anderson", email: "daniel.a@example.com", dob: new Date("1987-10-14"), phone: "+1 555-0233", address: "159 Cypress Ave, Denver, CO" },
    { name: "Sophia Thomas", email: "sophia.t@example.com", dob: new Date("1996-01-05"), phone: "+1 555-0244", address: "623 Chestnut Rd, Atlanta, GA" },
    { name: "James White", email: "james.white@example.com", dob: new Date("1980-08-30"), phone: "+1 555-0255", address: "847 Willow St, Phoenix, AZ" },
    { name: "Olivia Harris", email: "olivia.h@example.com", dob: new Date("1993-12-19"), phone: "+1 555-0266", address: "501 Magnolia Dr, Charlotte, NC" },
    { name: "William Clark", email: "william.c@example.com", dob: new Date("1986-04-25"), phone: "+1 555-0277", address: "934 Birch Way, Minneapolis, MN" },
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

  // 4. Create 20 Policies across Customers
  const policyData = [
    { customerId: createdCustomers[0].id, policyType: "Health Insurance", policyNumber: "POL-HEALTH-5001", premiumAmount: 320.0, startDate: new Date("2026-01-01"), endDate: new Date("2027-01-01"), status: "ACTIVE" },
    { customerId: createdCustomers[0].id, policyType: "Auto Insurance", policyNumber: "POL-AUTO-5002", premiumAmount: 190.0, startDate: new Date("2025-08-01"), endDate: new Date("2026-08-01"), status: "ACTIVE" },
    
    { customerId: createdCustomers[1].id, policyType: "Health Insurance", policyNumber: "POL-HEALTH-1001", premiumAmount: 250.0, startDate: new Date("2026-01-01"), endDate: new Date("2027-01-01"), status: "ACTIVE" },
    { customerId: createdCustomers[1].id, policyType: "Auto Insurance", policyNumber: "POL-AUTO-1002", premiumAmount: 180.0, startDate: new Date("2025-08-10"), endDate: new Date("2026-08-10"), status: "ACTIVE" },
    
    { customerId: createdCustomers[2].id, policyType: "Home Insurance", policyNumber: "POL-HOME-2001", premiumAmount: 410.0, startDate: new Date("2025-01-01"), endDate: new Date("2026-01-01"), status: "EXPIRED" },
    { customerId: createdCustomers[2].id, policyType: "Life Insurance", policyNumber: "POL-LIFE-2002", premiumAmount: 500.0, startDate: new Date("2026-02-01"), endDate: new Date("2027-02-01"), status: "ACTIVE" },
    
    { customerId: createdCustomers[3].id, policyType: "Auto Insurance", policyNumber: "POL-AUTO-3001", premiumAmount: 210.0, startDate: new Date("2025-11-01"), endDate: new Date("2026-11-01"), status: "ACTIVE" },
    { customerId: createdCustomers[3].id, policyType: "Health Insurance", policyNumber: "POL-HEALTH-3002", premiumAmount: 380.0, startDate: new Date("2025-03-01"), endDate: new Date("2026-03-01"), status: "EXPIRED" },
    
    { customerId: createdCustomers[4].id, policyType: "Life Insurance", policyNumber: "POL-LIFE-4001", premiumAmount: 600.0, startDate: new Date("2026-03-15"), endDate: new Date("2027-03-15"), status: "ACTIVE" },
    { customerId: createdCustomers[5].id, policyType: "Home Insurance", policyNumber: "POL-HOME-5003", premiumAmount: 450.0, startDate: new Date("2025-07-01"), endDate: new Date("2026-07-01"), status: "ACTIVE" },
    { customerId: createdCustomers[6].id, policyType: "Health Insurance", policyNumber: "POL-HEALTH-6001", premiumAmount: 280.0, startDate: new Date("2025-09-01"), endDate: new Date("2026-09-01"), status: "ACTIVE" },
    { customerId: createdCustomers[7].id, policyType: "Auto Insurance", policyNumber: "POL-AUTO-7001", premiumAmount: 175.0, startDate: new Date("2024-05-01"), endDate: new Date("2025-05-01"), status: "CANCELLED" },
    
    { customerId: createdCustomers[8].id, policyType: "Health Insurance", policyNumber: "POL-HEALTH-8001", premiumAmount: 340.0, startDate: new Date("2026-02-10"), endDate: new Date("2027-02-10"), status: "ACTIVE" },
    { customerId: createdCustomers[8].id, policyType: "Home Insurance", policyNumber: "POL-HOME-8002", premiumAmount: 520.0, startDate: new Date("2025-04-01"), endDate: new Date("2026-04-01"), status: "EXPIRED" },
    { customerId: createdCustomers[9].id, policyType: "Auto Insurance", policyNumber: "POL-AUTO-9001", premiumAmount: 230.0, startDate: new Date("2025-10-01"), endDate: new Date("2026-10-01"), status: "ACTIVE" },
    { customerId: createdCustomers[10].id, policyType: "Life Insurance", policyNumber: "POL-LIFE-10001", premiumAmount: 750.0, startDate: new Date("2026-01-15"), endDate: new Date("2027-01-15"), status: "ACTIVE" },
    { customerId: createdCustomers[11].id, policyType: "Health Insurance", policyNumber: "POL-HEALTH-11001", premiumAmount: 295.0, startDate: new Date("2025-06-01"), endDate: new Date("2026-06-01"), status: "EXPIRED" },
    { customerId: createdCustomers[12].id, policyType: "Home Insurance", policyNumber: "POL-HOME-12001", premiumAmount: 480.0, startDate: new Date("2026-04-01"), endDate: new Date("2027-04-01"), status: "ACTIVE" },
    { customerId: createdCustomers[13].id, policyType: "Auto Insurance", policyNumber: "POL-AUTO-13001", premiumAmount: 205.0, startDate: new Date("2025-12-01"), endDate: new Date("2026-12-01"), status: "ACTIVE" },
    { customerId: createdCustomers[14].id, policyType: "Health Insurance", policyNumber: "POL-HEALTH-14001", premiumAmount: 310.0, startDate: new Date("2026-05-01"), endDate: new Date("2027-05-01"), status: "ACTIVE" },
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

  // 5. Create 14 Claims
  await prisma.claim.deleteMany();
  const claimData = [
    { policyId: createdPolicies[0].id, claimAmount: 1250.00, reason: "Specialist consultation & hospital scans", status: "PENDING", submissionDate: new Date("2026-07-10") },
    { policyId: createdPolicies[1].id, claimAmount: 480.00, reason: "Windshield replacement from road debris", status: "APPROVED", submissionDate: new Date("2026-06-14") },
    { policyId: createdPolicies[2].id, claimAmount: 2100.00, reason: "Emergency surgery and medication", status: "APPROVED", submissionDate: new Date("2026-05-20") },
    { policyId: createdPolicies[3].id, claimAmount: 350.00, reason: "Rear bumper dent repair", status: "APPROVED", submissionDate: new Date("2026-04-11") },
    { policyId: createdPolicies[4].id, claimAmount: 3400.00, reason: "Water damage restoration from plumbing failure", status: "REJECTED", submissionDate: new Date("2025-12-05") },
    { policyId: createdPolicies[6].id, claimAmount: 890.00, reason: "Side mirror and door scratch repair", status: "PENDING", submissionDate: new Date("2026-07-18") },
    { policyId: createdPolicies[8].id, claimAmount: 1500.00, reason: "Inpatient medical diagnostic procedures", status: "PENDING", submissionDate: new Date("2026-07-19") },
    { policyId: createdPolicies[9].id, claimAmount: 2800.00, reason: "Roof shingle storm damage repair", status: "APPROVED", submissionDate: new Date("2026-03-01") },
    { policyId: createdPolicies[12].id, claimAmount: 1100.00, reason: "Outpatient orthopedic therapy and MRI", status: "APPROVED", submissionDate: new Date("2026-06-02") },
    { policyId: createdPolicies[13].id, claimAmount: 4200.00, reason: "Kitchen pipe burst flood claim", status: "REJECTED", submissionDate: new Date("2026-02-15") },
    { policyId: createdPolicies[14].id, claimAmount: 620.00, reason: "Tail light repair from rear parking scrape", status: "PENDING", submissionDate: new Date("2026-07-21") },
    { policyId: createdPolicies[15].id, claimAmount: 5000.00, reason: "Critical illness hospital stay claim", status: "APPROVED", submissionDate: new Date("2026-04-28") },
    { policyId: createdPolicies[18].id, claimAmount: 1750.00, reason: "Engine transmission repair from flood road", status: "PENDING", submissionDate: new Date("2026-07-20") },
    { policyId: createdPolicies[19].id, claimAmount: 950.00, reason: "Dental surgery & emergency procedure", status: "APPROVED", submissionDate: new Date("2026-06-25") },
  ];

  await prisma.claim.createMany({ data: claimData });

  // 6. Create 20 Premium Payments
  await prisma.premiumPayment.deleteMany();
  const premiumData = [
    { policyId: createdPolicies[0].id, amount: 320.0, paymentStatus: "PAID", paymentDate: new Date("2026-01-05") },
    { policyId: createdPolicies[0].id, amount: 320.0, paymentStatus: "PAID", paymentDate: new Date("2026-04-05") },
    { policyId: createdPolicies[1].id, amount: 190.0, paymentStatus: "PAID", paymentDate: new Date("2026-02-01") },
    
    { policyId: createdPolicies[2].id, amount: 250.0, paymentStatus: "PAID", paymentDate: new Date("2026-01-05") },
    { policyId: createdPolicies[2].id, amount: 250.0, paymentStatus: "PAID", paymentDate: new Date("2026-04-05") },
    { policyId: createdPolicies[3].id, amount: 180.0, paymentStatus: "PAID", paymentDate: new Date("2026-02-01") },
    
    { policyId: createdPolicies[4].id, amount: 410.0, paymentStatus: "OVERDUE", paymentDate: new Date("2025-12-01") },
    { policyId: createdPolicies[5].id, amount: 500.0, paymentStatus: "PAID", paymentDate: new Date("2026-02-05") },
    
    { policyId: createdPolicies[6].id, amount: 210.0, paymentStatus: "OVERDUE", paymentDate: new Date("2026-06-01") },
    { policyId: createdPolicies[8].id, amount: 600.0, paymentStatus: "PAID", paymentDate: new Date("2026-03-20") },
    { policyId: createdPolicies[9].id, amount: 450.0, paymentStatus: "OVERDUE", paymentDate: new Date("2026-07-01") },
    
    { policyId: createdPolicies[12].id, amount: 340.0, paymentStatus: "PAID", paymentDate: new Date("2026-03-01") },
    { policyId: createdPolicies[13].id, amount: 520.0, paymentStatus: "OVERDUE", paymentDate: new Date("2026-05-01") },
    { policyId: createdPolicies[14].id, amount: 230.0, paymentStatus: "PAID", paymentDate: new Date("2026-02-15") },
    { policyId: createdPolicies[15].id, amount: 750.0, paymentStatus: "PAID", paymentDate: new Date("2026-01-20") },
    { policyId: createdPolicies[17].id, amount: 480.0, paymentStatus: "OVERDUE", paymentDate: new Date("2026-06-15") },
    { policyId: createdPolicies[18].id, amount: 205.0, paymentStatus: "PAID", paymentDate: new Date("2026-01-10") },
    { policyId: createdPolicies[19].id, amount: 310.0, paymentStatus: "PAID", paymentDate: new Date("2026-05-10") },
  ];

  await prisma.premiumPayment.createMany({ data: premiumData });

  // 7. Create Sample Documents
  await prisma.document.deleteMany();
  await prisma.document.createMany({
    data: [
      { customerId: createdCustomers[0].id, fileName: "samreena_passport_id.pdf", filePath: "uploads/samreena-passport.pdf" },
      { customerId: createdCustomers[0].id, fileName: "health_declaration_form.pdf", filePath: "uploads/health-form.pdf" },
      { customerId: createdCustomers[1].id, fileName: "john_doe_drivers_license.pdf", filePath: "uploads/john-license.pdf" },
      { customerId: createdCustomers[2].id, fileName: "sarah_property_deed.pdf", filePath: "uploads/property-deed.pdf" },
      { customerId: createdCustomers[3].id, fileName: "michael_chen_vehicle_reg.pdf", filePath: "uploads/vehicle-reg.pdf" },
      { customerId: createdCustomers[4].id, fileName: "priya_life_insurance_medical.pdf", filePath: "uploads/medical-report.pdf" },
    ],
  });

  console.log("\nExpanded database seeding completed successfully!");
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
