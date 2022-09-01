const express = require('express');

const router = express.Router()

router.route('')
/**
 * @apiDescription Get all orders
 */
.get()

/**
 * @apiDescription Add new order
 */
.post()

/**
 * @description update order
 */
.patch()


router.route('/:id')
/**
 * @apiDescription Get details of an order 
 */
.get()
/**
 * @apiDescription Delete a order
 */
.delete()


/**
 * @description Get orders for current user
 */
router.get('/:email')


module.exports = router;