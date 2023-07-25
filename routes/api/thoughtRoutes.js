const router = require('express').Router();

// Requests
const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require('../../controllers/thoughtController');

// GET and POST thoughts 
router.route('/').get(getThoughts).post(createThought);

// GET, PUT and DELETE ThoughtId 
router
  .route('/:thoughtId')
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought);

// ADD Thought reaction
router.route('/:thoughtId/reactions').post(addReaction);

// DELETE all thoughts
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

module.exports = router;