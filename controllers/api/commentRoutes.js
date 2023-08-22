const router = require ('express').Router();
const { Comment } = require ('../../models');
const withAuth = require('../../utils/auth');

// Get all comments
router.get('/', async (req, res) => {
    try{
      const result = await Comment.findAll();
      const comments = result.map((comment) => {
          return comment.get({plain: true})
      })
      res.status(200).json(comments);
    }
    catch(err) {
      res.status(500).json(err);
    }
});

// Create a comment
router.post('/',  withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
  })
    res.status(200).json(newComment)
  }
  catch(err) {
    res.status(500).json(err);
  }
});

// UPDATE a comment
router.put('/:id', async (req, res) => {
  try {
  const commentData = await Comment.update(req.body, {
    where: {
      id: req.params.id
    }
  });
  if (!commentData) {
    res.status(400).json({ message: "No comment found with that id!" });
    return;
  }
  res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete comment
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id
      },
    });

    if(!commentData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }
    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;