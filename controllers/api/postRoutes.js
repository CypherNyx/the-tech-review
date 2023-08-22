const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const { withAuth } = require('../../utils/auth')


// Get all posts
router.get('/', async (req, res) => {
  try {
    const postsData = await Post.findAll({
      include: [
        {
          model: Comment
        }
      ]
    });
    res.status(200).json(postsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a post
router.post('/', withAuth, async (req, res) => {
  try {
    console.log(req.body);
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    // console.log(newPost);
    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Get post by ID
router.get('/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        { 
          model: User 
        }, 
        {
          model: Comment
        }
      ]
    });
    if (!postData) {
      res.status(404).json({ message: 'No post with this id!' });
      return;
    }
    res.render('post', { post: postData });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update post
router.put('/:id', async (req, res) => {
  try {
    const postData = await Post.findOne({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(400).json({ message: "No post found with that id!" });
      return;
    }

    const updatedPost = await postData.update(req.body);
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }
    res.status(200).json(postData);
  }catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;