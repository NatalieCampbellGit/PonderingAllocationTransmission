const { User, Thought } = require('../models');

const UserController = {
  async usersGetAll(req, res) {
    try {
      const userData = await User.find({}).select('-__v');
      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json({ err, message: 'Could not retrieve the users' });
    }
  },

  async usersGetAllPopulated(req, res) {
    try {
      const userData = await User.find({})
        .select('-__v')
        .populate('thoughts')
        .populate('friends');
      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json({ err, message: 'Could not retrieve the users' });
    }
  },

  async userGetById(req, res) {
    try {
      const userData = await User.findById(req.params.userId)
        .select('-__v')
        .populate('thoughts')
        .populate('friends');
      if (!userData) {
        return res.status(404).json({ message: 'User not found' });
      } else {
        res.status(200).json(userData);
      }
    } catch (err) {
      res.status(404).json({ err, message: 'Could not find user with this id' });
    }
  },

  async userCreate(req, res) {
    try {
      const userData = await User.create(req.body);
      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json({ err, message: 'Could not create user' });
    }
  },

  async userUpdateById(req, res) {
    try {
      const userData = await User.findById(req.params.userId);
      if (!userData) {
        return res.status(404).json({ message: 'User not found' });
      }
      const oldUsername = userData.username;
      const { username, email } = req.body;
      if (!username || !email) {
        return res.status(400).json({ message: 'Username and email are required' });
      }
      let changeUserName = false;
      if (username) {
        if (username !== oldUsername) {
          changeUserName = true;
          userData.username = username;
        }
      }
      if (email) {
        userData.email = email;
      }
      await userData.save({ runValidators: true, new: true });

      if (changeUserName) {
        await Thought.updateMany(
          { username: oldUsername },
          { username: req.body.username },
          { runValidators: true, new: true }
        );
        res.status(200).json({
          userData,
          message: "User updated successfully and their Thoughts' username updated if applicable",
        });
      } else {
        res.status(200).json({ userData, message: 'User updated successfully' });
      }
    } catch (err) {
      res.status(500).json({ err, message: 'An error occurred updating user' });
    }
  },

  async userDeleteById(req, res) {
    try {
      const userData = await User.findOne({ _id: req.params.userId });
      if (!userData) {
        return res.status(404).json({ message: 'User not found' });
      }

      try {
        await Thought.deleteMany({ username: userData.username });
      } catch (err) {
        console.error(err);
      }

      try {
        await User.updateMany(
          { friends: userData._id },
          { $pull: { friends: userData._id } },
          { runValidators: true, new: true }
        );
      } catch (err) {
        console.error(err);
      }

      await User.deleteOne({ _id: req.params.userId });
      res.status(200).json({
        message: "User deleted successfully, their Thoughts deleted if any, and the user was deleted from other users' friends lists if applicable",
      });
    } catch (err) {
      res.status(500).json({ err, message: 'An error occurred deleting user' });
    }
  },

  async friendAddLink(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true, runValidators: true }
      );
      if (!userData) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'Friend Added to User successfully', userData });
    } catch (err) {
      res.status(500).json({ err, message: 'An error occurred adding friend' });
    }
  },

  async friendRemoveLink({ params }, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true, runValidators: true }
      );
      if (!dbUserData) {
        return res.status(404).json({ message: 'No User with this id' });
      }
      const removed = !dbUserData.friends.includes(params.friendId);
      if (removed) {
        res.status(200).json({
          message: 'Friend removed from Friend List successfully',
          dbUserData,
        });
      } else {
        res.status(500).json({ dbUserData, message: 'An error occurred removing friend' });
      }
    } catch (err) {
      res.status(400).json({ err, message: 'An error occurred removing friend' });
    }
  },
};

module.exports = UserController;