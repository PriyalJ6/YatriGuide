import Transport from '../models/transport.models.js'
import { ApiError } from '../utils/api-error.js'
import { ApiResponse } from '../utils/api-response.js'
import { asyncHandler } from '../utils/async-handler.js'

// GET /api/v1/transport?city=mumbai&type=metro&featured=true&servesAirport=true
export const getAllTransport = asyncHandler(async (req, res) => {
  const { city, type, featured, servesAirport } = req.query

  const filter = { isActive: true }

  if (city)         filter.citySlug = city
  if (type)         filter.type = { $in: type.split(',') }
  if (featured)     filter.isFeatured = featured === 'true'
  if (servesAirport) filter.servesAirport = servesAirport === 'true'

  const transport = await Transport.find(filter)
    .sort({ order: 1, isFeatured: -1 })  // respect manual order first, featured next

  res.status(200).json(new ApiResponse(200, transport, 'Transport options fetched successfully'))
})

// GET /api/v1/transport/:city/:slug
export const getTransportBySlug = asyncHandler(async (req, res) => {
  const { city, slug } = req.params

  const transport = await Transport.findOne({
    slug,
    citySlug: city,
    isActive: true
  })

  if (!transport) {
    throw new ApiError(404, 'Transport option not found in this city')
  }

  res.status(200).json(new ApiResponse(200, transport, 'Transport option fetched successfully'))
})