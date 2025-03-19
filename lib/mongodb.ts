import clientPromise from "@/lib/mongodb";

async function testMongo() {
  try {
    console.log("Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db("createlive");
    console.log("Connected to MongoDB ✅");

    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}

testMongo();
