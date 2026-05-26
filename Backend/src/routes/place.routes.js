import express from 'express'
import { getAllPlaces, getPlaceBySlug } from '../controllers/place.controllers.js'

const router = express.Router()

router.route('/').get(getAllPlaces)
router.route('/:city/:slug').get(getPlaceBySlug)

export default router