const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// Get all posts
router.get('/', (req, res) => {
    Post.findAll({
      attributes: [
        'id',
        'title',
        'content',
        'user_id',
        'created_at'],
      include: [
        {
          model: Comment,
          attributes: ['id', 'content', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['name']
          }
        },
        {
          model: User,
          attributes: ['name']
        }
      ]
    })
      .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true}));

        res.render('home', {
            posts,
            loggedIn: req.session.loggedIn,
            username: req.session.username
        })
    })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// login
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

// signup
router.get('/signup', (req, res) => {
  res.render('signup');
});

module.exports = router;