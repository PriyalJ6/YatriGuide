import Shopping from '../models/shopping.models.js'
import { ApiError } from '../utils/api-error.js'
import { ApiResponse } from '../utils/api-response.js'
import { asyncHandler } from '../utils/async-handler.js'

// GET /api/v1/shopping?city=mumbai&type=bazaar&categories=jewellery,fabrics&featured=true&minRating=4&page=1&limit=10&lat=19.07&lng=72.87&radius=5
export const getAllMarkets = asyncHandler(async (req, res) => {
  const {
    city, type, categories, featured,
    minRating, page, limit, lat, lng, radius,
  } = req.query

  const filter = { isActive: true }

  if (city)       filter.citySlug   = city
  if (type)       filter.type       = { $in: type.split(',') }
  if (featured)   filter.isFeatured = featured === 'true'
  if (minRating)  filter.rating     = { $gte: Number(minRating) }
  if (categories) filter.categories = { $in: categories.split(',') }

  // GEO FILTER — $geoWithin is compatible with countDocuments (unlike $near)
  if (lat && lng && radius) {
    const radiusInRadians = parseFloat(radius) / 6378.1
    filter.location = {
      $geoWithin: {
        $centerSphere: [
          [parseFloat(lng), parseFloat(lat)],
          radiusInRadians,
        ],
      },
    }
  }

  const pageNum  = parseInt(page)  || 1
  const limitNum = parseInt(limit) || 10
  const skip     = (pageNum - 1) * limitNum

  const total = await Shopping.countDocuments(filter)

  const markets = await Shopping.find(filter)
    .sort({ isFeatured: -1, rating: -1 })
    .skip(skip)
    .limit(limitNum)

  res.status(200).json(new ApiResponse(200, {
    markets,
    pagination: {
      total,
      page:        pageNum,
      limit:       limitNum,
      totalPages:  Math.ceil(total / limitNum),
      hasNextPage: pageNum < Math.ceil(total / limitNum),
      hasPrevPage: pageNum > 1,
    },
  }, 'Markets fetched successfully'))
})

// GET /api/v1/shopping/:city/:slug
export const getMarketBySlug = asyncHandler(async (req, res) => {
  const { city, slug } = req.params

  const market = await Shopping.findOne({
    slug,
    citySlug: city,
    isActive: true,
  })

  if (!market) {
    throw new ApiError(404, 'Market not found in this city')
  }

  res.status(200).json(new ApiResponse(200, market, 'Market fetched successfully'))
})