import express from "express";
import multer from "multer";
import { z } from "zod";
import prisma from "../utils/prismaClient.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `claim-doc-${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

const createClaimSchema = z.object({
  policyId: z.union([z.string(), z.number()]),
  claimAmount: z.union([z.string(), z.number()]),
  reason: z.string().min(1),
});

// Submit a claim, with optional supporting document upload
router.post("/", authenticate, upload.single("document"), async (req, res) => {
  try {
    const parsed = createClaimSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten().fieldErrors });
    }
    const { policyId, claimAmount, reason } = parsed.data;

    const claim = await prisma.claim.create({
      data: { policyId: Number(policyId), claimAmount, reason },
    });

    // If a supporting document was attached, save it against the policy's customer
    if (req.file) {
      const policy = await prisma.policy.findUnique({ where: { id: Number(policyId) } });
      if (policy) {
        await prisma.document.create({
          data: {
            customerId: policy.customerId,
            fileName: req.file.originalname,
            filePath: req.file.path,
          },
        });
      }
    }

    res.status(201).json(claim);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit claim" });
  }
});

// Claim history / list — filter by status, paginated. Customers see only their own.
router.get("/", authenticate, async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const where = {
    ...(status ? { status } : {}),
    ...(req.user.role === "CUSTOMER" ? { policy: { customerId: req.user.id } } : {}),
  };

  const [claims, total] = await Promise.all([
    prisma.claim.findMany({
      where,
      include: { policy: { include: { customer: true } } },
      orderBy: { submissionDate: "desc" },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.claim.count({ where }),
  ]);

  res.json({ claims, total, page: Number(page), limit: Number(limit) });
});

// Claim verification + approve/reject decision (Agent/Admin)
router.patch("/:id/decision", authenticate, authorize("ADMIN", "AGENT"), async (req, res) => {
  const { decision } = req.body; // "APPROVED" | "REJECTED"
  if (!["APPROVED", "REJECTED"].includes(decision)) {
    return res.status(400).json({ message: "decision must be APPROVED or REJECTED" });
  }
  const claim = await prisma.claim.update({
    where: { id: Number(req.params.id) },
    data: { status: decision },
  });
  res.json(claim);
});

export default router;
