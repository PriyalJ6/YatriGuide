import Agency from '../models/agency.models.js'
import { ApiError } from '../utils/api-error.js'
import { ApiResponse } from '../utils/api-response.js'
import { asyncHandler } from '../utils/async-handler.js'

export const getAllAgencies = asyncHandler(async (req, res) => {
  const {
    city,
    specialisation,
    travelStyle,
    groupType,
    minRating,
    minPrice,
    maxPrice,
    featured,
    page,
    limit,
  } = req.query

  const filter = { isActive: true }

  if (city)           filter.citySlugs     = city.toLowerCase()
  if (specialisation) filter.specialisations = { $in: specialisation.split(',').map(s => s.trim()) }
  if (travelStyle)    filter.travelStyles    = { $in: travelStyle.split(',').map(s => s.trim()) }
  if (groupType)      filter.groupTypes      = { $in: groupType.split(',').map(s => s.trim()) }
  if (featured)       filter.isFeatured      = featured === 'true'
  if (minRating)      filter.rating          = { $gte: Number(minRating) }

  if (minPrice || maxPrice) {
    filter['priceRange.min'] = {}
    if (minPrice) filter['priceRange.min'].$gte = Number(minPrice)
    if (maxPrice) filter['priceRange.min'].$lte = Number(maxPrice)
  }

  const pageNum  = Math.max(parseInt(page) || 1, 1)
  const limitNum = Math.min(parseInt(limit) || 10, 50)   // cap at 50 per page
  const skip     = (pageNum - 1) * limitNum

  const [agencies, total] = await Promise.all([
    Agency.find(filter)
      .select('-embedding')
      .sort({ isFeatured: -1, isVerified: -1, rating: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Agency.countDocuments(filter),
  ])

  const totalPages = Math.ceil(total / limitNum)

  res.status(200).json(
    new ApiResponse(
      200,
      {
        agencies,
        pagination: {
          total,
          page:        pageNum,
          limit:       limitNum,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
      'Agencies fetched successfully'
    )
  )
})

export const getAgencyBySlug = asyncHandler(async (req, res) => {
  const agency = await Agency.findOne({
    slug:     req.params.slug,
    isActive: true,
  })
    .select('-embedding')
    .populate('cities', 'name slug')   // only pull name + slug from City
    .lean()

  if (!agency) {
    throw new ApiError(404, 'Agency not found')
  }

  res.status(200).json(
    new ApiResponse(200, agency, 'Agency fetched successfully')
  )
})