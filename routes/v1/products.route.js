const express = require('express');

const router = express.Router();


router.route('')
/**
 * @api {get} /products All products
 * @apiDescription Get all the products
 * @apiPermission admin
 * 
 * @apiHeader {String} Authorization User's access token
 * 
 * @apiParam {Number{1-}}    [page=1]   List page
 * @apiParam {Number{1-100}}   [limit=10] Users per page
 * 
 * @apiSuccess {Object[]} all the products.
 * 
 * @apiError {Unauthorized 401} Unauthorized Only authenticated users can access the data
 * @apiError {Forbidden 403}   Forbidden     Only admin can access the data
 */

.get()

/**
 * @api {post} /products All products
 * @apiDescription Get all the products
 * @apiPermission admin
 * 
 * @apiHeader {String} Authorization User's access token
 * 
 * @apiParam {Number{1-}}    [page=1]   List page
 * @apiParam {Number{1-100}}   [limit=10] Users per page
 * 
 * @apiSuccess {Object[]} all the products.
 * 
 * @apiError {Unauthorized 401} Unauthorized Only authenticated users can access the data
 * @apiError {Forbidden 403}   Forbidden     Only admin can access the data
 */

.post()


router.route('/:id').get().delete()


module.exports = router;