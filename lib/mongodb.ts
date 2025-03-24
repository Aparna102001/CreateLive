import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Make sure this is set
if (!uri) {
  throw new Error("⚠️ MONGODB_URI is not defined in .env");
}

let client;
let db;

async function connectDB() {
  if (!client) {
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000, // Increases timeout
    });
    await client.connect();
    console.log("✅ Connected to MongoDB");
  }
  db = client.db(); // Select the default database
  return db;
}

export default connectDB;

