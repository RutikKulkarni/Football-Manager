import express from "express";
import { body } from "express-validator";
import { authenticate, register, login } from "../controllers/authController";
import { validateRequest } from "../middleware/validateRequest";

const router = express.Router();

const authValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

router.post("/", authValidation, validateRequest, authenticate);

router.post("/login", authValidation, validateRequest, login);
router.post("/register", authValidation, validateRequest, register);

export default router;
