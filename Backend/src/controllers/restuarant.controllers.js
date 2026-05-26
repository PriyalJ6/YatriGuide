import Restaurant from '../models/restaurant.models.js'
import { ApiError } from '../utils/api-error.js'
import { ApiResponse } from '../utils/api-response.js'
import { asyncHandler } from '../utils/async-handler.js'

// GET /api/v1/restaurants?city=mumbai&category=casual&featured=true&cuisine=mughlai&priceRange=₹₹&minRating=4&page=1&limit=10&lat=19.07&lng=72.87&radius=5
export const getAllRestaurants = asyncHandler(async (req, res) => {
  const { city, category, featured, cuisine, priceRange, minRating, page, limit, lat, lng, radius } = req.query

  const filter = { isActive: true }

  if (city)       filter.citySlug = city
  if (category)   filter.category = filter.category = { $in: category.split(',') }
  if (featured)   filter.isFeatured = featured === 'true'
  if (cuisine)    filter.cuisine = { $in: cuisine.split(',') }
  if (priceRange) filter.priceRange = priceRange
  if (minRating)  filter.rating = { $gte: Number(minRating) }

  // ✅ GEO Filter
if (lat && lng && radius) {
  const radiusInRadians = parseFloat(radius) / 6378.1
  filter.location = {
    $geoWithin: {
      $centerSphere: [
        [parseFloat(lng), parseFloat(lat)],
        radiusInRadians
      ]
    }
  }
}

  const pageNum  = parseInt(page) || 1
  const limitNum = parseInt(limit) || 10
  const skip     = (pageNum - 1) * limitNum

// Now this just works cleanly for both geo and non-geo:
const total = await Restaurant.countDocuments(filter)

  const restaurants = await Restaurant.find(filter)
    .sort({ isFeatured: -1, rating: -1 })
    .skip(skip)
    .limit(limitNum)

  res.status(200).json(new ApiResponse(200, {
    restaurants,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: pageNum < Math.ceil(total / limitNum),
      hasPrevPage: pageNum > 1
    }
  }, 'Restaurants fetched successfully'))
})

// GET /api/v1/restaurants/:city/:slug
export const getRestaurantBySlug = asyncHandler(async (req, res) => {
  const { city, slug } = req.params

  const restaurant = await Restaurant.findOne({
    slug,
    citySlug: city,
    isActive: true
  })

  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found in this city')
  }

  res.status(200).json(new ApiResponse(200, restaurant, 'Restaurant fetched successfully'))
})