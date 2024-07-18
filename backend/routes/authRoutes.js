const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/new_user', authController.createUser);

module.exports = router;
