const router = require('express').Router();

// Requests
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require('../../controllers/userController');

// GET and POST User 
router.route('/').get(getUsers).post(createUser);

// GET, PUT and DELETE User ID 
router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);

// POST and DELETE User friends 
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;
