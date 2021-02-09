const { Router } = require('express');
const IndexRouter = require('./entry');
const UserRouter = require('./users');

// Init router and path
const router = Router();

// Add sub-routes
router.use('/', IndexRouter);
router.use('/users', UserRouter);

// Export the base-router 
module.exports = router;