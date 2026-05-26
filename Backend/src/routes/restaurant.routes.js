import express from 'express'
import { getAllRestaurants, getRestaurantBySlug } from '../controllers/restuarant.controllers.js'

const router = express.Router()

router.route('/').get(getAllRestaurants)
router.route('/:city/:slug').get(getRestaurantBySlug)

export default router