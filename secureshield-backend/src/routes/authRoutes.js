import express from "express";
import { register, login, customerLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);        // Admin/Agent registration
router.post("/login", login);               // Admin/Agent login
router.post("/customer-login", customerLogin); // Customer login

export default router;
