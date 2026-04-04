import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from "./models/User.js"
import Subreddit from './models/Subreddit.js';
import Thread from './models/Thread.js';


async function query1() {
    // Query 1: Find user by email "diana@example.com"
    const user = await User.findOne({ email: "diana@example.com" });
    console.log("User found:", user);
}

async function query2() {
    // Query 2: Get threads in subreddit "programming"
    const subreddit = await Subreddit.findOne({ name: "programming" });
    if (!subreddit) {
        console.log("Subreddit not found");
        return;
    }

    const threads = await Thread.find({ subreddit: subreddit._id });
    console.log("Threads in subreddit 'programming':", threads);
}

async function query3() {
    // Query 3: Threads posted by a specific user "Ethan"
    const user = await User.findOne({ name: "Ethan" });
    if (!user) {
        console.log("User 'Ethan' not found");
        return;
    }

    const threads = await Thread.find({ author: user._id });
    console.log("Threads posted by Ethan:", threads);
}

async function query4() {
    // Query 4: Users who posted threads
    const threads = await Thread.find().populate("author");
    const users = threads.map(thread => thread.author);

    // Remove duplicates by converting to a Set
    const uniqueUsers = Array.from(new Set(users.map(user => user._id.toString()))).map(id => {
        return users.find(user => user._id.toString() === id);
    });

    console.log("Users who posted threads:", uniqueUsers);
}

async function query5() {
    // Query 5: Delete all threads by user "Ethan"
    const user = await User.findOne({ name: "Ethan" });
    if (!user) {
        console.log("User 'Ethan' not found");
        return;
    }

    const result = await Thread.deleteMany({ author: user._id });
    console.log(`Deleted ${result.deletedCount} threads by Ethan.`);
}

// more queries

async function runQueries() {
    // Uncomment the query you want to run
     await query1();
     await query2();
     await query3();
     await query4();
     await query5();
    // more
}

async function main() {
  try {
    dotenv.config();
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");
    await runQueries();
  } catch (err) {
    console.error("DB connection failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from DB");
  }
}

main();