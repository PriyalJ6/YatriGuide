import express from 'express'
import { getAllAgencies, getAgencyBySlug } from '../controllers/agency.controllers.js'

const router = express.Router()

// GET /api/v1/agencies
router.route('/').get(getAllAgencies)

// GET /api/v1/agencies/:slug
router.route('/:slug').get(getAgencyBySlug)

export default router