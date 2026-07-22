import express from "express";
import PDFDocument from "pdfkit";
import prisma from "../utils/prismaClient.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

async function buildSummary() {
  const [activePolicies, expiredPolicies, totalClaims, approvedClaims, rejectedClaims, totalCustomers] =
    await Promise.all([
      prisma.policy.count({ where: { status: "ACTIVE" } }),
      prisma.policy.count({ where: { status: "EXPIRED" } }),
      prisma.claim.count(),
      prisma.claim.count({ where: { status: "APPROVED" } }),
      prisma.claim.count({ where: { status: "REJECTED" } }),
      prisma.customer.count(),
    ]);

  const premiumCollection = await prisma.premiumPayment.aggregate({
    _sum: { amount: true },
    where: { paymentStatus: "PAID" },
  });

  return {
    activePolicies,
    expiredPolicies,
    totalClaims,
    approvedClaims,
    rejectedClaims,
    totalCustomers,
    totalPremiumCollected: premiumCollection._sum.amount || 0,
  };
}

// Dashboard summary — feeds the Chart.js charts on the frontend
router.get("/summary", authenticate, authorize("ADMIN"), async (req, res) => {
  const summary = await buildSummary();
  res.json(summary);
});

// Monthly business report as a downloadable PDF (PDFKit)
router.get("/export/pdf", authenticate, authorize("ADMIN"), async (req, res) => {
  const summary = await buildSummary();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=monthly-business-report.pdf");

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  doc.fontSize(20).text("SecureShield — Monthly Business Report", { align: "center" });
  doc.moveDown();
  doc.fontSize(10).fillColor("gray").text(new Date().toLocaleDateString(), { align: "center" });
  doc.moveDown(2);

  doc.fontSize(12).fillColor("black");
  const rows = [
    ["Active Policies", summary.activePolicies],
    ["Expired Policies", summary.expiredPolicies],
    ["Total Customers", summary.totalCustomers],
    ["Total Claims", summary.totalClaims],
    ["Approved Claims", summary.approvedClaims],
    ["Rejected Claims", summary.rejectedClaims],
    ["Total Premium Collected", summary.totalPremiumCollected],
  ];

  rows.forEach(([label, value]) => {
    doc.text(`${label}:`, { continued: true }).text(`  ${value}`, { align: "right" });
  });

  doc.end();
});

export default router;
