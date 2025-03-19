// pages/api/auth/signup.tsx
import { clientPromise } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Only POST requests are allowed" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        console.log("Connecting to MongoDB...");
        const client = await clientPromise;
        console.log("Connected to MongoDB");
        const db = client.db("createlive");

        console.log("Checking if user exists with email:", email);
        const existingUser = await db.collection("users").findOne({ email });

        if (existingUser) {
            console.log("User already exists:", existingUser);
            return res.status(400).json({ message: "User already exists" });
        }

        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed Password:", hashedPassword);

        console.log("Inserting user into database...");
        const result = await db.collection("users").insertOne({ email, password: hashedPassword });

        console.log("Insert Result:", result);

        if (result.acknowledged) {
            return res.status(201).json({ message: "User created successfully" });
        } else {
            return res.status(500).json({ message: "Error creating user" });
        }
    } catch (error) {
        console.error("Error during user creation:", error.message);
        return res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
}
