import Hotel from '../models/hotel.models.js'
import { ApiError } from '../utils/api-error.js'
import { ApiResponse } from '../utils/api-response.js'
import { asyncHandler } from '../utils/async-handler.js'

// GET /api/v1/hotels?city=mumbai&type=resort&featured=true&stars=4&minRating=4&minPrice=2000&maxPrice=8000&amenities=Pool,Gym&page=1&limit=10&lat=19.07&lng=72.87&radius=5
export const getAllHotels = asyncHandler(async (req, res) => {
  const { city, type, featured, stars, minRating, minPrice, maxPrice, amenities, page, limit, lat, lng, radius } = req.query

  const filter = { isActive: true }

  if (city)      filter.citySlug = city
  if (type)      filter.type = { $in: type.split(',') }
  if (featured)  filter.isFeatured = featured === 'true'
  if (stars)     filter.stars = Number(stars)
  if (minRating) filter.rating = { $gte: Number(minRating) }
  if (minPrice)  filter['priceRange.min'] = { $gte: Number(minPrice) }
  if (maxPrice)  filter['priceRange.max'] = { $lte: Number(maxPrice) }
  if (amenities) filter.amenities = { $all: amenities.split(',') }

  // GEO FILTER — uses $geoWithin + $centerSphere instead of $near
  // $near is incompatible with .countDocuments(), which breaks pagination.
  // $geoWithin works with both .find() and .countDocuments() cleanly.
  if (lat && lng && radius) {
    const radiusInRadians = parseFloat(radius) / 6378.1 // km ÷ Earth's radius
    filter.location = {
      $geoWithin: {
        $centerSphere: [
          [parseFloat(lng), parseFloat(lat)],
          radiusInRadians
        ]
      }
    }
  }

  const pageNum  = parseInt(page)  || 1
  const limitNum = parseInt(limit) || 10
  const skip     = (pageNum - 1) * limitNum

  const total = await Hotel.countDocuments(filter)

  const hotels = await Hotel.find(filter)
    .sort({ isFeatured: -1, rating: -1 })
    .skip(skip)
    .limit(limitNum)

  res.status(200).json(new ApiResponse(200, {
    hotels,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: pageNum < Math.ceil(total / limitNum),
      hasPrevPage: pageNum > 1
    }
  }, 'Hotels fetched successfully'))
})

// GET /api/v1/hotels/:city/:slug
export const getHotelBySlug = asyncHandler(async (req, res) => {
  const { city, slug } = req.params

  const hotel = await Hotel.findOne({
    slug,
    citySlug: city,
    isActive: true
  })

  if (!hotel) {
    throw new ApiError(404, 'Hotel not found in this city')
  }

  res.status(200).json(new ApiResponse(200, hotel, 'Hotel fetched successfully'))
})