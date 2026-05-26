import express from 'express'
import { getAllTransport, getTransportBySlug } from '../controllers/transport.controllers.js'

const router = express.Router()

router.route('/').get(getAllTransport)
router.route('/:city/:slug').get(getTransportBySlug)

export default router