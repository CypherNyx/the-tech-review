const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const session = require('express-session');
const withAuth = require('../../utils/auth');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Create a new user
router.post('/', async (req, res) => {
    try {
        const userData = await User.create(req.body);
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            console.log(userData);

            res.json({ user: userData, message: "You Signed up!" });


        });
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});


// User Login
router.post("/login", async (req, res) => {
    try {
        const userData = await User.findOne({ where: { email: req.body.email } });
        if (!userData) {
            console.log("Incorrect username or password, please try again.")
            res
                .status(400)
                .json({ message: "Incorrect username or password, please try again" });
            return;
        }
        const validPassword = await userData.checkPassword(req.body.password);
        if (!validPassword) {
            console.log("Incorrect password");
            res
                .status(400)
                .json({ message: "Incorrect email or password, please try again" });
            return;
        }
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            console.log(userData, `logged in: ${req.session.logged_in}`, `user_id: ${req.session.user_id}`)

            res.json({ user: userData, message: "You are now logged in!" });
        });
    } catch (err) {
        res.status(400).json(err);
    }
});



// Get user by ID
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'content', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'content', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            }
        ]
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const result = await User.findAll({
            attributes: {
                exclude: ["password"]
            }
        });
        const users = result.map((user) => {
            return user.get({ plain: true })
        })
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json(err);
    }
})

// Update user
router.put('/:id', async (req, res) => {
    try {
        const result = await User.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        if (!result) {
            res.status(404).json({ "message": "User not found" })
        }
        res.status(200).json(result);

    }
    catch (err) {
        res.status(500).json(err);
    }
})

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        const result = await User.destroy({
            where: {
                id: req.params.id
            }
        })
        if (!result) {
            res.status(404).json({ "message": "User not found" })
        }
        res.status(200).json(result);

    }
    catch (err) {
        res.status(500).json(err);
    }
})

// User Logout
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  });




module.exports = router;