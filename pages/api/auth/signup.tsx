import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    console.log("🔄 Connecting to MongoDB for signup...");
    const client = await clientPromise;
    if (!client) {
      console.error("❌ clientPromise resolved to undefined!");
      return res.status(500).json({ message: "MongoDB connection failed" });
    }

    console.log("✅ MongoDB Client obtained!");
    const db = client.db("createlive");
    console.log("✅ Database selected:", db.databaseName);

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists:", existingUser);
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("🔄 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("🔄 Inserting user into database...");
    const result = await db.collection("users").insertOne({ email, password: hashedPassword });

    console.log("✅ Insert Result:", result);

    if (result.acknowledged) {
      return res.status(201).json({ message: "User created successfully" });
    } else {
      console.error("❌ Insert failed");
      return res.status(500).json({ message: "Error creating user" });
    }
  } catch (error) {
    console.error("❌ Signup API Error:", error);
    return res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
}


