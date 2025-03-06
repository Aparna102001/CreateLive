// pages/api/auth/signup.tsx
import { clientPromise } from "@/lib/mongodb"; // Corrected import
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("createlive");

    const existingUser = await db.collection("users").findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection("users").insertOne({ username, password: hashedPassword });

    if (result.acknowledged) {
      return res.status(201).json({ message: "User created successfully" });
    } else {
      return res.status(500).json({ message: "Error creating user" });
    }
  } catch (error) {
    console.error("Error during user creation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
