import express from "express";
import { body, query } from "express-validator";
import {
  getTransferMarket,
  addPlayerToTransferList,
  removePlayerFromTransferList,
  buyPlayer,
} from "../controllers/transferController";
import { authenticate } from "../middleware/auth";
import { validateRequest } from "../middleware/validateRequest";

const router = express.Router();

router.use(authenticate);

router.get(
  "/",
  [
    query("teamName").optional().isString(),
    query("playerName").optional().isString(),
    query("minPrice").optional().isNumeric(),
    query("maxPrice").optional().isNumeric(),
  ],
  validateRequest,
  getTransferMarket
);

router.post(
  "/list/:playerId",
  [
    body("askingPrice")
      .isNumeric()
      .withMessage("Asking price must be a number"),
  ],
  validateRequest,
  addPlayerToTransferList
);

router.delete("/list/:playerId", removePlayerFromTransferList);

router.post("/buy/:playerId", buyPlayer);

export default router;
