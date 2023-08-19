const router = require('express').Router();
const { Post, User } = require('../../models');
const { withAuth } = require('../../utils/auth')

// Create a post
router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create(req.body)
    res.json(newPost)
  }
  catch(err) {
    res.json(err);
  }
});

// Get post by ID
router.get('/:id', async (req, res) => {
  try{
    const result = await Post.findByPk(req.params.id);
    if(result) {
      const post = result.get({plain:true});
      res.status(404).json({"error": "Post not found"});
    }
  }
  catch(err) {
    res.status(500).json(err);
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const result = await Post.findAll();
    const post = result.map((post) =>{
        return post.get({plain: true})
    })
    res.status(200).json(posts);
  }
  catch(err) {
    res.status(500).json(err);
  }
});

// Update post
router.put('/:id', async (req, res) => {
    try{
      const result = await Post.update(req.body, {
        where: {
          id: req.params.id
        }
      })
      if (!result) {
        res.status(404).json({"message": "Post not found"})
      }
      res.status(200).json(result);
    } 
    catch (err){
        res.status(500).json(err);
    }
});

// Delete post
router.delete('/:id', async (req, res) => {
    try{
      const result = await Post.destroy({
        where: {
          id: req.params.id
        }
      })
      if (!result) {
        res.status(404).json({"message": "Post not found"})
      }
      res.status(200).json(result);
    } 
    catch (err){
      res.status(500).json(err);

    }
})


module.exports = router;