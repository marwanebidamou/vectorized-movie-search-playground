import OpenAI from "openai";
import { Movie, MovieModel } from "../models/movie.model";
import { error } from "console";

const openai = new OpenAI();



export async function fillData() {
    try {
        //Load json initial data
        let data: Movie[] = require("../../movies.json");
        console.log('fillData: movies.json data loaded');

        //data = data.slice(0, 5);
        //Generate embedding
        data = await generateEmbeddings(data);

        //Save embedded movies in mongo
        await saveMovies(data);

        await MovieModel.insertMany(data);
    } catch (err) {
        console.log('Error reading or parsing file:', err);
    }
}




async function generateEmbeddings(movies: Movie[]) {
    try {
        console.log('generateEmbeddings: start generating embedded data');

        const embedding = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: movies.map(x => x.name + ' ' + x.description),
            encoding_format: "float",
        });
        if (embedding.data.length == movies.length) {
            movies = movies.map((element, index) => ({ ...element, embedding: embedding.data[index].embedding }));
            console.log('generateEmbeddings: embedded data generated succesfully');
            return movies;
        } else {
            const error = 'Error generating embedding for movies : count of response different to intial count';
            console.error(error);
            throw Error(error);
        }
    } catch (error) {
        console.error('Error generating embedding for movies:', error);
        throw error;
    }

}

// Save function
async function saveMovies(movies: Movie[]) {
    try {
        console.log('saveMovies : start saving movies data in mongo database');
        await MovieModel.insertMany(movies);
        console.log(`saveMovies : Saved ${movies.length} movies`);
    } catch (error) {
        console.error('Error saving movies:', error);
        throw error;
    }
}

export async function semanticSearchMovies(query: string) {
    if (!query) {
        throw new Error("Query cannot be empty.");
    }

    try {
        // Generate the embedding for the query using OpenAI API
        const embedding = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: query,
            encoding_format: "float",
        });

        // MongoDB aggregation pipeline using $vectorSearch
        const pipeline = [
            {
                $vectorSearch: {
                    index: "vector_index", // Name of Atlas Vector Search Index
                    path: "embedding", // Field in the database storing the embedding
                    queryVector: embedding.data[0].embedding, // Embedding vector generated from the query
                    limit: 5, // Number of results to return
                    numCandidates: 10, // Optional: number of candidates to consider
                    exact: false, // Use approximate search; set to true for exact match

                },
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    score: { $meta: "vectorSearchScore" }, // Include similarity score
                },
            },
        ];

        // Execute the aggregation pipeline
        const results = await MovieModel.aggregate(pipeline);
        return results;
    } catch (error) {
        console.error("Error performing semantic vector search:", error);
        throw new Error("Semantic vector search failed.");
    }
}