import { MongoClient } from "mongodb";
import { MONGODB_URI } from "./env.config";


if (!MONGODB_URI) {
  console.error("Missing MongoDB URI in environment variables.");
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI);

export async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

export function getDatabase(dbName: string) {
  return client.db(dbName);
}

export function getCollection(dbName: string, collectionName: string) {
  return getDatabase(dbName).collection(collectionName);
}
