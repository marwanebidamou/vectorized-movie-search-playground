import express from "express";
import { seedMoviesInitialData } from "../controllers/mainController";

const router = express.Router();

router.post('/data/seed', seedMoviesInitialData);

export default router;