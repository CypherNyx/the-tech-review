const apiRoutes = require('./api');
const router = require('express').Router();
const homeRoutes = require('./homeRoute');

router.use('/api', apiRoutes);
router.use('/', homeRoutes);

module.exports = router;