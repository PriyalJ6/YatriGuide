import Place from '../models/place.models.js'
import { ApiError } from '../utils/api-error.js'
import { ApiResponse } from '../utils/api-response.js'
import { asyncHandler } from '../utils/async-handler.js'

// GET /api/v1/places?city=mumbai&category=monument&featured=true&tags=heritage&minRating=4&page=1&limit=10
export const getAllPlaces = asyncHandler(async (req, res) => {
  const { city, category, featured, tags, minRating, page,limit,lat,lng,radius} = req.query

  const filter = { isActive: true }

  if (city)      filter.citySlug = city
  if (category)  filter.category = { $in: category.split(',') }
  if (featured)  filter.isFeatured = featured === 'true'
  if (tags)      filter.tags = { $in: tags.split(',') }
  if (minRating) filter.rating = { $gte: Number(minRating) }

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

  const total = await Place.countDocuments(filter)

  const places = await Place.find(filter)
    .select('-history -timeline -embedding')
    .sort({ isFeatured: -1, rating: -1 })
    .skip(skip)
    .limit(limitNum)

  res.status(200).json(new ApiResponse(200, {
    places,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: pageNum < Math.ceil(total / limitNum),
      hasPrevPage: pageNum > 1
    }
  }, 'Places fetched successfully'))
})


// GET /api/v1/places/:city/:slug
export const getPlaceBySlug = asyncHandler(async (req, res) => {
  const { city, slug } = req.params

  const place = await Place.findOne({
    slug,
    citySlug: city,
    isActive: true
  })

  if (!place) {
    throw new ApiError(404, 'Place not found in this city')
  }

  res.status(200).json(
    new ApiResponse(200, place, 'Place fetched successfully')
  )
})