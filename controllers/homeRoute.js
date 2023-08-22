const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// * Get all posts
router.get('/', async (req, res) => {
  try {
    // GET all posts and JOIN with user data
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: Comment,
          attributes: ["content"],
        },
      ],
    });
    // Serialize data so the template can read it
    // converts the Sequelize model to plain JavaScript
    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// * Display posts to homepage
// Find all posts from DB and display on homepage including the associated User and Comments
router.get('/homepage', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Comment,
          attributes: ['comment'],
          include: [User],
        },
      ],
    });  
    // Serialize data. converts the Sequelize model to plain JavaScript
    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('homepage', {
      posts,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// * Get Post by id
// Find a single post from the database based on the id
router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Comment,
          include: [User],
        },
      ],
    });

    // Serialize. converts the Sequelize model to plain JavaScript
    const post = postData.get({ plain: true });

    res.render('post', {
      ...post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// * DASHBOARD: withAuth middleware makes sure that the user is authenticated BEFORE accessing the dashboard.
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged in user data from DB based on the user_id property in the req.session object. It excludes the password attribute from the query result
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [
        { 
          model: Post 
        }
      ],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// * update post by id
router.get('/updatepost', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        }
      ],
    });

    // Serialize data so the template can read it
    const post = postData.get({ plain: true });

    res.render('updatepost', {
      post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// * login redirect
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

// * signup
router.get('/signup', (req, res) => {
  res.render('signup');
});

module.exports = router;