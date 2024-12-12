import { Schema, model, InferSchemaType } from 'mongoose';

// Define Mongoose Schema
const MovieSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    embedding: { type: [Number], required: true }
});

//Infer type
export type Movie = InferSchemaType<typeof MovieSchema>;


export const MovieModel = model<Movie>('movie', MovieSchema);
