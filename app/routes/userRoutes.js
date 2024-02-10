const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

router.get('/users', userController.createUser);
// Add routes that require authentication middleware here
// router.get('/users/:id', isAuthenticated, userController.getUser);

module.exports = router;
