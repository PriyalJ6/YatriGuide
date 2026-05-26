import express from 'express'
import { getAllMarkets, getMarketBySlug } from '../controllers/shopping.contollers.js';

const router = express.Router()

router.route('/').get(getAllMarkets)
router.route('/:city/:slug').get(getMarketBySlug)

export default router