import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prismaClient.js";

const SALT_ROUNDS = 10;

function issueToken(payload) {
  const secret = process.env.JWT_SECRET || "secureshield_super_secret_key_2026";
  return jwt.sign(payload, secret, { expiresIn: "8h" });
}

// POST /api/auth/register (creates an Admin or Agent — internal staff account)
export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "name, email, password, and role are required" });
    }
    if (!["ADMIN", "AGENT"].includes(role)) {
      return res.status(400).json({ message: "role must be ADMIN or AGENT" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "A user with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
}

// POST /api/auth/login (Admin/Agent login)
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = issueToken({ id: user.id, role: user.role, email: user.email });
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
}

// POST /api/auth/customer-login (Customer login)
export async function customerLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer || !(await bcrypt.compare(password, customer.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = issueToken({ id: customer.id, role: "CUSTOMER", email: customer.email });
    res.json({ token, user: { id: customer.id, name: customer.name, role: "CUSTOMER" } });
  } catch (err) {
    console.error("Customer login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
}
