import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import prisma from "./utils/prismaClient.js";

import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import policyRoutes from "./routes/policyRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";
import premiumRoutes from "./routes/premiumRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ status: "SecureShield API is running" }));

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/premiums", premiumRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/reports", reportRoutes);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

async function ensureSeedData() {
  try {
    const adminCount = await prisma.user.count();
    if (adminCount === 0) {
      console.log("Database empty. Auto-seeding default accounts...");
      const adminPass = await bcrypt.hash("Admin@123", 10);
      const agentPass = await bcrypt.hash("Agent@123", 10);
      const custPass = await bcrypt.hash("Customer@123", 10);

      await prisma.user.create({ data: { name: "Suruthi", email: "suruthi@secureshield.test", password: adminPass, role: "ADMIN" } });
      await prisma.user.create({ data: { name: "Gokul", email: "gokul@secureshield.test", password: agentPass, role: "AGENT" } });
      await prisma.customer.create({
        data: {
          name: "Samreena",
          email: "samreena@example.com",
          password: custPass,
          dob: new Date("1995-08-22"),
          phone: "+1 555-0188",
          address: "45 Palm Avenue, Grand Boulevard",
        },
      });
      console.log("Auto-seeding complete!");
    }
  } catch (err) {
    console.error("Auto-seed check error:", err);
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`SecureShield backend running on port ${PORT}`);
  await ensureSeedData();
});
