import express from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "../utils/prismaClient.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const createCustomerSchema = z.object({
  name: z.string().min(1),
  dob: z.string(),
  phone: z.string().min(5),
  address: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

// Register a customer (Admin or Agent creates the account)
router.post("/", authenticate, authorize("ADMIN", "AGENT"), validate(createCustomerSchema), async (req, res) => {
  try {
    const { name, dob, phone, address, email, password } = req.body;
    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: "A customer with this email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await prisma.customer.create({
      data: { name, dob: new Date(dob), phone, address, email, password: hashedPassword },
    });
    res.status(201).json({ id: customer.id, name: customer.name, email: customer.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to register customer" });
  }
});

// View all customers, search by name/email (?search=), paginated (?page=&limit=)
router.get("/", authenticate, authorize("ADMIN", "AGENT"), async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;
  const where = search
    ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] }
    : undefined;

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.count({ where }),
  ]);

  res.json({ customers, total, page: Number(page), limit: Number(limit) });
});

// View a single customer profile + their history (policies, documents)
router.get("/:id", authenticate, async (req, res) => {
  const customer = await prisma.customer.findUnique({
    where: { id: Number(req.params.id) },
    include: { policies: true, documents: true },
  });
  if (!customer) return res.status(404).json({ message: "Customer not found" });
  res.json(customer);
});

// Edit customer information
router.put("/:id", authenticate, authorize("ADMIN", "AGENT"), async (req, res) => {
  const { name, phone, address } = req.body;
  const customer = await prisma.customer.update({
    where: { id: Number(req.params.id) },
    data: { name, phone, address },
  });
  res.json(customer);
});

export default router;
