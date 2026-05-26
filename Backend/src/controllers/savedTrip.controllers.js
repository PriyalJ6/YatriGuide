import SavedTrip from '../models/savedTrip.models.js'
import { ApiError } from '../utils/api-error.js'
import { ApiResponse } from '../utils/api-response.js'
import { asyncHandler } from '../utils/async-handler.js'

// POST /api/v1/trips
export const createTrip = asyncHandler(async (req, res) => {
  const { title, city, citySlug, source, startDate, endDate, params, itinerary, rawResponse, isPublic } = req.body

  if (!title) {
    throw new ApiError(400, 'Trip title is required')
  }

  const trip = await SavedTrip.create({
    user:            req.user._id,
    title,
    city:            city        || undefined,
    citySlug:        citySlug    || '',
    source:          source      || 'manual',
    startDate:       startDate   || undefined,
    endDate:         endDate     || undefined,
    params:          params      || {},
    itinerary:       itinerary   || [],
    rawResponse:     rawResponse || undefined,
    isPublic:        isPublic    || false,
    progressPercent: itinerary?.length > 0 ? 10 : 0,
  })

  res.status(201).json(new ApiResponse(201, trip, 'Trip created'))
})

// GET /api/v1/trips?source=manual|ai&page=1&limit=10
export const getUserTrips = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id }

  if (req.query.source) filter.source = req.query.source

  const pageNum  = parseInt(req.query.page)  || 1
  const limitNum = parseInt(req.query.limit) || 10
  const skip     = (pageNum - 1) * limitNum

  const total = await SavedTrip.countDocuments(filter)

  const trips = await SavedTrip.find(filter)
    .select('-rawResponse')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean()

  res.status(200).json(new ApiResponse(200, {
    trips,
    pagination: {
      total,
      page:        pageNum,
      limit:       limitNum,
      totalPages:  Math.ceil(total / limitNum),
      hasNextPage: pageNum < Math.ceil(total / limitNum),
      hasPrevPage: pageNum > 1,
    },
  }, 'Trips fetched'))
})

// GET /api/v1/trips/:tripId
export const getTripById = asyncHandler(async (req, res) => {
  const trip = await SavedTrip.findOne({
    _id:  req.params.tripId,
    user: req.user._id,
  }).lean()

  if (!trip) {
    throw new ApiError(404, 'Trip not found')
  }

  res.status(200).json(new ApiResponse(200, trip, 'Trip fetched'))
})

// PATCH /api/v1/trips/:tripId
export const updateTrip = asyncHandler(async (req, res) => {
  const allowed = ['title', 'citySlug', 'startDate', 'endDate', 'progressPercent', 'isPublic']
  const updates = {}

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key]
    }
  }

  const trip = await SavedTrip.findOneAndUpdate(
    { _id: req.params.tripId, user: req.user._id },
    updates,
    { new: true }
  )

  if (!trip) {
    throw new ApiError(404, 'Trip not found')
  }

  res.status(200).json(new ApiResponse(200, trip, 'Trip updated'))
})

// PATCH /api/v1/trips/:tripId/day
export const addOrUpdateDay = asyncHandler(async (req, res) => {
  const { day, title, narrative, places } = req.body

  if (!day) {
    throw new ApiError(400, 'day number is required')
  }

  const trip = await SavedTrip.findOne({
    _id:  req.params.tripId,
    user: req.user._id,
  })

  if (!trip) {
    throw new ApiError(404, 'Trip not found')
  }

  const existingIndex = trip.itinerary.findIndex(d => d.day === day)

  const dayData = {
    day,
    title:     title     || `Day ${day}`,
    narrative: narrative || '',
    places:    places    || [],
  }

  if (existingIndex !== -1) {
    trip.itinerary[existingIndex] = dayData
  } else {
    trip.itinerary.push(dayData)
    trip.itinerary.sort((a, b) => a.day - b.day)
  }

  await trip.save()

  res.status(200).json(new ApiResponse(200, trip, 'Day updated'))
})

// DELETE /api/v1/trips/:tripId/day/:dayNumber
export const removeDay = asyncHandler(async (req, res) => {
  const dayNumber = parseInt(req.params.dayNumber)

  const trip = await SavedTrip.findOneAndUpdate(
    { _id: req.params.tripId, user: req.user._id },
    { $pull: { itinerary: { day: dayNumber } } },
    { new: true }
  )

  if (!trip) {
    throw new ApiError(404, 'Trip not found')
  }

  res.status(200).json(new ApiResponse(200, trip, 'Day removed'))
})

// DELETE /api/v1/trips/:tripId
export const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await SavedTrip.findOneAndDelete({
    _id:  req.params.tripId,
    user: req.user._id,
  })

  if (!trip) {
    throw new ApiError(404, 'Trip not found')
  }

  res.status(200).json(new ApiResponse(200, null, 'Trip deleted'))
})