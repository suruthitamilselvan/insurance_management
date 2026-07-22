import express from "express";
import { z } from "zod";
import prisma from "../utils/prismaClient.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const recordPaymentSchema = z.object({
  policyId: z.union([z.string(), z.number()]),
  amount: z.union([z.string(), z.number()]),
});

// Record a premium payment
router.post("/", authenticate, validate(recordPaymentSchema), async (req, res) => {
  try {
    const { policyId, amount } = req.body;
    const payment = await prisma.premiumPayment.create({
      data: { policyId: Number(policyId), amount, paymentStatus: "PAID" },
    });
    res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to record payment" });
  }
});

// Payment history for a policy (paginated)
router.get("/policy/:policyId", authenticate, async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const payments = await prisma.premiumPayment.findMany({
    where: { policyId: Number(req.params.policyId) },
    orderBy: { paymentDate: "desc" },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });
  res.json(payments);
});

// Overdue premium alerts (Admin/Agent)
router.get("/overdue", authenticate, authorize("ADMIN", "AGENT"), async (req, res) => {
  const overdue = await prisma.premiumPayment.findMany({
    where: { paymentStatus: "OVERDUE" },
    include: { policy: { include: { customer: true } } },
  });
  res.json(overdue);
});

export default router;
