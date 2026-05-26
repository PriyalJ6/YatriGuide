import express from 'express'
import { getAllEvents, getEventBySlug, getFeaturedEvents } from '../controllers/event.controllers.js'

const router = express.Router()

router.route('/featured').get(getFeaturedEvents)
router.route('/').get(getAllEvents)
router.route('/:city/:slug').get(getEventBySlug)

export default router