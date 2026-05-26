import City from '../models/city.models.js'
import { ApiError } from '../utils/api-error.js'
import { ApiResponse } from '../utils/api-response.js'
import { asyncHandler } from '../utils/async-handler.js'

// GET /api/cities
export const getAllCities = asyncHandler(async (req, res) => {
  const cities = await City.find({ isActive: true }).sort({ order: 1 })
  res.status(200).json(new ApiResponse(200, cities, 'Cities fetched successfully'))
})

// GET /api/cities/:slug
export const getCityBySlug = asyncHandler(async (req, res) => {
  const city = await City.findOne({ slug: req.params.slug, isActive: true })

  if (!city) {
    throw new ApiError(404, 'City not found')
  }

  res.status(200).json(new ApiResponse(200, city, 'City fetched successfully'))
})