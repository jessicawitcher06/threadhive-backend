import fs from 'fs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Thread from '../models/Thread.js';
import Subreddit from '../models/Subreddit.js';

// Connect to the database
mongoose.connect('mongodb://localhost:27017/threadhive', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
    console.log('Connected to the database');

    const results = [];

    try {
        // Clear collections
        await User.deleteMany({});
        await Thread.deleteMany({});
        await Subreddit.deleteMany({});
        results.push('Cleared all collections.');

        // Create test data
        const user = new User({ username: 'testuser', email: 'testuser@example.com', password: 'password123' });
        await user.save();
        results.push('Created User: ' + JSON.stringify(user));

        const subreddit = new Subreddit({ name: 'testsubreddit', description: 'A test subreddit' });
        await subreddit.save();
        results.push('Created Subreddit: ' + JSON.stringify(subreddit));

        const thread = new Thread({ title: 'Test Thread', content: 'This is a test thread', author: user._id, subreddit: subreddit._id });
        await thread.save();
        results.push('Created Thread: ' + JSON.stringify(thread));

        // Read operations
        const foundUser = await User.findOne({ username: 'testuser' });
        results.push('Found User: ' + JSON.stringify(foundUser));

        const foundSubreddit = await Subreddit.findOne({ name: 'testsubreddit' });
        results.push('Found Subreddit: ' + JSON.stringify(foundSubreddit));

        const foundThread = await Thread.findOne({ title: 'Test Thread' }).populate('author').populate('subreddit');
        results.push('Found Thread: ' + JSON.stringify(foundThread));

        // Update operations
        foundUser.email = 'updateduser@example.com';
        await foundUser.save();
        results.push('Updated User: ' + JSON.stringify(await User.findById(foundUser._id)));

        foundSubreddit.description = 'Updated description';
        await foundSubreddit.save();
        results.push('Updated Subreddit: ' + JSON.stringify(await Subreddit.findById(foundSubreddit._id)));

        foundThread.content = 'Updated content';
        await foundThread.save();
        results.push('Updated Thread: ' + JSON.stringify(await Thread.findById(foundThread._id).populate('author').populate('subreddit')));

        // Delete operations
        await User.deleteOne({ _id: foundUser._id });
        results.push('Deleted User: ' + JSON.stringify(await User.findById(foundUser._id)));

        await Subreddit.deleteOne({ _id: foundSubreddit._id });
        results.push('Deleted Subreddit: ' + JSON.stringify(await Subreddit.findById(foundSubreddit._id)));

        await Thread.deleteOne({ _id: foundThread._id });
        results.push('Deleted Thread: ' + JSON.stringify(await Thread.findById(foundThread._id)));

    } catch (error) {
        results.push('Error during CRUD operations: ' + error.message);
    } finally {
        // Write results to a Markdown file
        const markdownContent = results.map((result, index) => `### Test ${index + 1}\n\n${result}\n`).join('\n');
        fs.writeFileSync('../test_results.md', markdownContent);
        console.log('Test results written to test_results.md');

        // Close the database connection
        db.close(() => {
            console.log('Database connection closed');
        });
    }
});