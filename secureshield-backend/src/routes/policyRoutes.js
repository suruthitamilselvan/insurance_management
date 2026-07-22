import express from "express";
import { z } from "zod";
import prisma from "../utils/prismaClient.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const createPolicySchema = z.object({
  customerId: z.union([z.string(), z.number()]),
  policyType: z.string().min(1),
  policyNumber: z.string().min(1),
  premiumAmount: z.union([z.string(), z.number()]),
  startDate: z.string(),
  endDate: z.string(),
});

// Create a policy (Agent/Admin)
router.post("/", authenticate, authorize("ADMIN", "AGENT"), validate(createPolicySchema), async (req, res) => {
  try {
    const { customerId, policyType, policyNumber, premiumAmount, startDate, endDate } = req.body;
    const policy = await prisma.policy.create({
      data: {
        customerId: Number(customerId),
        policyType,
        policyNumber,
        premiumAmount,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });
    res.status(201).json(policy);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create policy (policyNumber may already exist)" });
  }
});

// View policies — filter by status, search by policyNumber, paginated
// Customers only see their own (req.user.role === "CUSTOMER" -> scoped to their id)
router.get("/", authenticate, async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;

  const where = {
    ...(status ? { status } : {}),
    ...(search ? { policyNumber: { contains: search, mode: "insensitive" } } : {}),
    ...(req.user.role === "CUSTOMER" ? { customerId: req.user.id } : {}),
  };

  const [policies, total] = await Promise.all([
    prisma.policy.findMany({
      where,
      include: { customer: true },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    }),
    prisma.policy.count({ where }),
  ]);

  res.json({ policies, total, page: Number(page), limit: Number(limit) });
});

// Policies expiring within the next 30 days (expiry notifications)
router.get("/expiring-soon", authenticate, authorize("ADMIN", "AGENT"), async (req, res) => {
  const in30Days = new Date();
  in30Days.setDate(in30Days.getDate() + 30);

  const policies = await prisma.policy.findMany({
    where: { status: "ACTIVE", endDate: { lte: in30Days } },
    include: { customer: true },
  });
  res.json(policies);
});

// Renew a policy — extends endDate by 1 year, marks ACTIVE
router.patch("/:id/renew", authenticate, authorize("ADMIN", "AGENT"), async (req, res) => {
  const policy = await prisma.policy.findUnique({ where: { id: Number(req.params.id) } });
  if (!policy) return res.status(404).json({ message: "Policy not found" });

  const newEndDate = new Date(policy.endDate);
  newEndDate.setFullYear(newEndDate.getFullYear() + 1);

  const updated = await prisma.policy.update({
    where: { id: policy.id },
    data: { endDate: newEndDate, status: "ACTIVE" },
  });
  res.json(updated);
});

// Cancel a policy
router.patch("/:id/cancel", authenticate, authorize("ADMIN", "AGENT"), async (req, res) => {
  const updated = await prisma.policy.update({
    where: { id: Number(req.params.id) },
    data: { status: "CANCELLED" },
  });
  res.json(updated);
});

export default router;
