// The User model is defined using Mongoose's Schema.
// The username and email fields are defined with required and unique properties to meet the requirements.
// The trim property is set to true for the username to automatically remove any leading/trailing white spaces.
// The email field uses a regex pattern for matching a valid email address.
// The thoughts and friends fields are defined as arrays of ObjectId references to the Thought and User models, respectively.
// We define a virtual property friendCount to calculate the length of the friends array.

const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Virtual to get the total count of a user's friends
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

const User = model('User', userSchema);

module.exports = User;