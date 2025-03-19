import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ MONGODB_URI is missing in environment variables!");
}

async function handler(req, res) {
  console.log("🔹 Received request:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  let client;
  try {
    console.log("🔹 Connecting to MongoDB...");
    client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("createlive");
    if (!db) {
      throw new Error("Database connection failed! `db` is undefined.");
    }

    // Get email and password from request body
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Missing required fields: email or password.");
    }

    const usersCollection = db.collection("users");

    // Check if email already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      throw new Error("Email already registered.");
    }

    // Insert new user
    await usersCollection.insertOne({ email, password });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("❌ Signup Error:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    if (client) await client.close();
  }
}

export default handler;
