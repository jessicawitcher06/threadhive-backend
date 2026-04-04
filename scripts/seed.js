import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import User from '../models/User.js';
import Subreddit from '../models/Subreddit.js';
import Thread from '../models/Thread.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Subreddit.deleteMany({});
        await Thread.deleteMany({});
        console.log('Cleared existing data');

        // Create users
        const users = [];
        for (let i = 0; i < 10; i++) {
            const user = new User({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                createdAt: faker.date.recent(60),
            });
            users.push(await user.save());
        }
        console.log('Created users');

        // Create subreddits
        const subreddits = [];
        for (let i = 0; i < 6; i++) {
            const subreddit = new Subreddit({
                name: faker.lorem.word(),
                description: faker.lorem.sentence(),
                author: users[Math.floor(Math.random() * users.length)]._id,
                createdAt: faker.date.recent(60),
            });
            subreddits.push(await subreddit.save());
        }
        console.log('Created subreddits');

        // Create threads
        for (let i = 0; i < 20; i++) {
            const thread = new Thread({
                title: faker.lorem.sentence(),
                content: faker.lorem.paragraph(),
                author: users[Math.floor(Math.random() * users.length)]._id,
                subreddit: subreddits[Math.floor(Math.random() * subreddits.length)]._id,
                upvotes: faker.number.int({ min: 0, max: 100 }),
                downvotes: faker.number.int({ min: 0, max: 100 }),
                voteCount: 0,
                createdAt: faker.date.recent(60),
            });
            thread.voteCount = thread.upvotes - thread.downvotes;
            await thread.save();
        }
        console.log('Created threads');

        console.log('Database seeding completed');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();