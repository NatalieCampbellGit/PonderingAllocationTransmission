const connection = require('../config/connection');
const { User, Thought } = require('../models');

connection.on('error', (err) => console.error(err));

connection.once('open', async () => {
  console.log('Connected to MongoDB!');

  try {
    await User.deleteMany({});
    await Thought.deleteMany({});

    // Seed data for users
    const users = [
      { username: 'Harry', email: 'harrypotter@email.com' },
      { username: 'Hermione', email: 'hermionegranger@email.com' },
      { username: 'Ron', email: 'ronaldwesley@email.com' },
    ];

    // Seed data for thoughts
    const thoughts = [
      {
        thoughtText: 'Yer a wizard Harry',
        username: users[0].username,
        reactions: [
          { reactionBody: 'Me too!', username: users[1].username },
          { reactionBody: 'It does not do to dwell on dreams and forget to live', username: users[2].username },
        ],
      },
      {
        thoughtText: 'Happiness can be found even in the darkest of times if one only remembers to turn on the light',
        username: users[0].username,
        reactions: [
          { reactionBody: 'Lumos', username: users[1].username },
          { reactionBody: 'the road to happiness lies in our own hands and is something every child must be taught', username: users[2].username },
        ],
      },
    ];

    // Insert seed data for users and thoughts
    const createdUsers = await User.insertMany(users);
    const createdThoughts = await Thought.insertMany(thoughts);

    // Update users with associated thoughts
    for (const thought of createdThoughts) {
      const user = createdUsers.find((user) => user.username === thought.username);
      user.thoughts.push(thought._id);
      await user.save();
    }

    console.log('Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
