const express = require('express');
const router = express.Router();
const limiter = require('../../middleware/limiter');
const authController = require('../../controllers/auth.controller');

/**
 * @apiDescription Register user
 */
router.post('/register', authController.register)

/**
 * @apiDescription Login user
 */
router.post('/login', limiter, authController.login )

module.exports = router;