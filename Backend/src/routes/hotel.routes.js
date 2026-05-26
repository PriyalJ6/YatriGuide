import express from 'express'
import { getAllHotels, getHotelBySlug } from '../controllers/hotel.controllers.js'

const router = express.Router()

router.route('/').get(getAllHotels)
router.route('/:city/:slug').get(getHotelBySlug)

export default router