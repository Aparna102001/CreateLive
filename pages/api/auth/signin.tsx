import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("[API] Received request:", req.method);

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and Password are required" });
    }

    console.log("[API] Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db("createlive"); // Make sure DB name is correct
    console.log("[API] Connected to MongoDB");

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      console.warn("[API] User not found:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.warn("[API] Incorrect password for:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.log("[API] Sign-in successful for:", email);
    return res.status(200).json({ message: "Sign-in successful", user });

  } catch (error) {
    console.error("[API] Sign-in error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Ensure Next.js parses request body
export const config = {
  api: {
    bodyParser: true,
  },
};
