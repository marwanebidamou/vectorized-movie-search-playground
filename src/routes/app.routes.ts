import express from "express";
import { seedMoviesInitialData, semanticVectorMovieSearch } from "../controllers/mainController";

const router = express.Router();

router.post('/data/seed', seedMoviesInitialData);

router.get('/movies', semanticVectorMovieSearch);


export default router;