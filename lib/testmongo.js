import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb+srv://createlive:createlive@cluster0.oftou.mongodb.net/createlive?retryWrites=true&w=majority";

async function testMongo() {
  try {
    console.log("🔹 Connecting to MongoDB...");
    const client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connected to MongoDB!");

    const db = client.db("createlive");
    const collections = await db.listCollections().toArray();
    console.log("📂 Collections:", collections);

    await client.close();
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
}

testMongo();
