import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/createlive";

async function testMongo() {
  try {
    console.log("Connecting to MongoDB...");
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("createlive");
    console.log("Connected to MongoDB ✅");

    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections);

    await client.close();
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}

testMongo();
