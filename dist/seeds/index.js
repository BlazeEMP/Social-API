import db from '../config/connection.js';
import { User, Thought } from '../models/index.js';
import { users, thoughts } from './data.js';
try {
    // connect to db
    await db();
    // reset db
    await User.deleteMany({});
    await Thought.deleteMany({});
    console.log('Database reset');
    // seed db
    await User.create(users);
    console.log('Users seeded');
    for (let thought of thoughts) {
        const user = await User.findOne({ username: thought.username });
        if (!user) {
            console.error(`User ${thought.username} not found!`);
            process.exit(1);
        }
        const thoughtCreate = await Thought.create({ ...thought, username: user.username });
        await User.findOneAndUpdate({ username: user.username }, { $push: { thoughts: thoughtCreate._id } });
    }
    console.log('Thoughts seeded');
    // Log out completion message and the seed data to indicate what should appear in the database
    console.info('Seeding complete!');
    console.table(users);
    console.table(thoughts);
    process.exit(0);
}
catch (error) {
    console.error('Error seeding database: ', error);
    process.exit(1);
}
