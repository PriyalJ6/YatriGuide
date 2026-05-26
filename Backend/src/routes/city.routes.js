import express from 'express'
import { getAllCities, getCityBySlug } from '../controllers/city.controllers.js'

const router = express.Router()

router.route('/').get(getAllCities)
router.route('/:slug').get(getCityBySlug)

export default router