const apiRoutes = require('./api');
const router = require('express').Router();
const homeRoutes = require('./homeRoute');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);

module.exports = router;