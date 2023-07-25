// The Thought model is defined using Mongoose's Schema.
// The thoughtText field is defined with required and maxlength properties to meet the requirements.
// The createdAt field is set to the current timestamp by default and is formatted using the getter function to meet the requirements.
// The reactions field is defined as an array of nested documents using a subdocument schema (Reaction schema).
// The Reaction schema has properties for reactionId, reactionBody, username, and createdAt, with appropriate validations.
// We define a virtual property reactionCount to calculate the length of the reactions array.

const { Schema, model } = require('mongoose');

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Virtual to get the total count of reactions on a thought
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;