import express from "express";
import multer from "multer";
import path from "path";
import prisma from "../utils/prismaClient.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Upload identity/policy documents
router.post("/upload", authenticate, upload.single("document"), async (req, res) => {
  try {
    const customerId = req.body.customerId || (req.user.role === "CUSTOMER" ? req.user.id : null);
    if (!customerId) return res.status(400).json({ message: "customerId is required" });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const document = await prisma.document.create({
      data: {
        customerId: Number(customerId),
        fileName: req.file.originalname,
        filePath: req.file.path,
      },
    });
    res.status(201).json(document);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload document" });
  }
});

// View uploaded files for a customer (self, or Admin/Agent for anyone)
router.get("/customer/:customerId", authenticate, async (req, res) => {
  if (req.user.role === "CUSTOMER" && req.user.id !== Number(req.params.customerId)) {
    return res.status(403).json({ message: "You can only view your own documents" });
  }
  const documents = await prisma.document.findMany({
    where: { customerId: Number(req.params.customerId) },
  });
  res.json(documents);
});

// Download a document
router.get("/:id/download", authenticate, async (req, res) => {
  const doc = await prisma.document.findUnique({ where: { id: Number(req.params.id) } });
  if (!doc) return res.status(404).json({ message: "Document not found" });
  res.download(path.resolve(doc.filePath), doc.fileName);
});

export default router;
