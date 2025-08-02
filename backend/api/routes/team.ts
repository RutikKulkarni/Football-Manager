import express from "express";
import { getTeam, getTeamPlayers } from "../controllers/teamController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.use(authenticate);

router.get("/", getTeam);
router.get("/players", getTeamPlayers);

export default router;
