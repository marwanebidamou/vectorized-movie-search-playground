import { Request, Response } from "express";
import { fillData } from "../services/seedDatabase";



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