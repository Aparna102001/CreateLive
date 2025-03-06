
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "";
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env.local");
}

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export default clientPromise;
