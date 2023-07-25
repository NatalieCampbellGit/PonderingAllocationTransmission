const { Thought, User } = require('../models');

const ThoughtController = {
  async thoughtsGetAll(req, res) {
    try {
      const thoughts = await Thought.find({}).select('-__v');
      res.status(200).json(thoughts);
    } catch (err) {
      res.status(500).json({ err, message: 'An error occurred getting thoughts' });
    }
  },

  async thoughtGetById(req, res) {
    try {
      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select('-__v');
      if (!thought) {
        res.status(404).json({ message: 'Thought not found' });
      } else {
        res.status(200).json(thought);
      }
    } catch (err) {
      res.status(500).json({ err, message: 'An error occurred finding a thought' });
    }
  },

  async thoughtCreate(req, res) {
    try {
      const userID = req.body.userId;

      if (!userID) {
        return res.status(404).json({ message: 'User not found' });
      }

      const userData = await User.findById(userID);
      if (!userData) {
        return res.status(404).json({ message: 'User not found' });
      }

      const thought = await Thought.create(req.body);

      await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thought._id } },
        { runValidators: true, new: true }
      );
      res.status(201).json(thought);
    } catch (err) {
      res.status(500).json({ err, message: 'An error occurred creating a thought' });
    }
  },

  async thoughtUpdateById(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        req.body,
        {
          runValidators: true,
          new: true,
        }
      );
      if (!thought) {
        res.status(404).json({ message: 'Thought not found' });
      } else {
        res.status(200).json(thought);
      }
    } catch (err) {
      res.status(500).json({ err, message: 'An error occurred updating a thought' });
    }
  },

  async thoughtDeleteById(req, res) {
    try {
      const thought = await Thought.findByIdAndDelete({
        _id: req.params.thoughtId,
      });
      if (!thought) {
        res.status(404).json({ message: 'Thought not found' });
      } else {
        res.status(200).json({ thought, message: 'Thought deleted' });
      }
    } catch (err) {
      res.status(500).json({ err, message: 'An error occurred deleting a thought' });
    }
  },

  async reactionCreateByThoughtId(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );
      if (thought) {
        res.status(200).json(thought);
      } else {
        res.status(404).json({ message: 'Thought not found' });
      }
    } catch (err) {
      res.status(500).json({ err, message: 'An error occurred creating a reaction' });
    }
  },

  async reactionDeleteById(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.body.reactionId } } },
        { runValidators: true, new: true }
      ).select('-__v');

      if (thought) {
        res.status(200).json(thought);
      } else {
        res.status(404).json({ message: 'Thought not found' });
      }
    } catch (err) {
      res.status(500).json({ err, message: 'An error occurred deleting a reaction' });
    }
  },
};

module.exports = ThoughtController;