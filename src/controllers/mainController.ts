import { NextFunction, Request, Response } from "express";
import { fillData, semanticSearchMovies } from "../services/seedDatabase";
import { read } from "fs";



export const seedMoviesInitialData = async (req: Request, res: Response) => {
    try {

        await fillData();
        res.status(201).json({
            message: 'Movies data seeded successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating movie',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const semanticVectorMovieSearch = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.q) {
        res.status(400).json({
            message: 'Query cannot be empty'
        });
    }

    const result = await semanticSearchMovies(req.query.q!.toString());
    res.status(200).json(result);

    try {

    } catch (error) {
        console.error("Error performing semantic vector search:", error);
        res.status(500).json({
            message: 'Semantic vector search failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
