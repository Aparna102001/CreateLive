import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  try {
    console.log("Received request:", req.method);

    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    console.log("Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db("createlive"); 
    console.log("Connected to MongoDB");

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      console.warn("User not found:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.warn("Incorrect password for:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Sign-in successful for:", email);
    return res.status(200).json({ message: "Sign-in successful", user });

  } catch (error) {
    console.error("Sign-in error:", error);
    console.error(error.stack); // Log full error details
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


// Ensure Next.js parses request body
export const config = {
  api: {
    bodyParser: true,
  },
};
