const express = require('express');
const router = express.Router();

/**
 * @apiDescription Get all users
 */
router.get('/users')

/**
 * @apiDescription Check if the user is admin
 */
router.get('/:email')

/**
 * @apiDescription Update users as admin
 */
router.put('/admin')



module.exports = router;