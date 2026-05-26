import Event from '../models/event.models.js'
import { ApiError } from '../utils/api-error.js'
import { ApiResponse } from '../utils/api-response.js'
import { asyncHandler } from '../utils/async-handler.js'


export const getAllEvents = asyncHandler(async (req, res) => {
  const {
    city, category,
    when, startFrom, startTo,
    isFree, maxPrice,
    featured, isMultiDay,
    lat, lng, radius,
    sort,
    page, limit,
  } = req.query

  const filter = { isActive: true }

  // ── Identity filters ──────────────────────────────────────────────────────
  if (city)       filter.citySlug = city
  if (category)   filter.category = { $in: category.split(',') }
  if (featured === 'true') filter.isFeatured = true
  if (isMultiDay) filter.isMultiDay = isMultiDay === 'true'

  // ── Date filters ──────────────────────────────────────────────────────────
  // Custom range takes priority; `when` is a convenience shortcut
  if (startFrom || startTo) {
    filter.startDate = {}
    if (startFrom) filter.startDate.$gte = new Date(startFrom)
    if (startTo)   filter.startDate.$lte = new Date(startTo)
  } else if (when) {
    const now   = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    if (when === 'today') {
      const endOfDay = new Date(today)
      endOfDay.setHours(23, 59, 59, 999)
      // Show events starting today OR already ongoing (multi-day that started earlier)
      filter.$or = [
        { startDate: { $gte: today, $lte: endOfDay } },
        { startDate: { $lte: today }, endDate: { $gte: today } },
      ]
    } else if (when === 'this-weekend') {
      const day       = now.getDay()
      const daysToSat = (6 - day + 7) % 7 || 7
      const saturday  = new Date(today); saturday.setDate(today.getDate() + daysToSat)
      const sunday    = new Date(saturday); sunday.setDate(saturday.getDate() + 1)
      sunday.setHours(23, 59, 59, 999)
      filter.$or = [
        { startDate: { $gte: saturday, $lte: sunday } },
        { startDate: { $lte: saturday }, endDate: { $gte: saturday } },
      ]
    } else if (when === 'this-week') {
      const endOfWeek = new Date(today)
      endOfWeek.setDate(today.getDate() + (7 - today.getDay()))
      endOfWeek.setHours(23, 59, 59, 999)
      filter.startDate = { $gte: today, $lte: endOfWeek }
    } else if (when === 'this-month') {
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
      filter.startDate = { $gte: today, $lte: endOfMonth }
    } else if (when === 'upcoming') {
      filter.startDate = { $gte: today }
    }
  }

  // ── Price filters ─────────────────────────────────────────────────────────
  if (isFree === 'true') {
    filter['ticketPrice.isFree'] = true
  } else if (maxPrice) {
    // Budget cap: show events whose minimum ticket fits what the user can spend
    filter['ticketPrice.isFree'] = { $ne: true }
    filter['ticketPrice.min'] = { $lte: Number(maxPrice) }
  }

  // ── Geo filter ────────────────────────────────────────────────────────────
  if (lat && lng && radius) {
    filter['venue.location'] = {
      $geoWithin: {
        $centerSphere: [
          [parseFloat(lng), parseFloat(lat)],
          parseFloat(radius) / 6378.1,
        ],
      },
    }
  }

  // ── Sort ──────────────────────────────────────────────────────────────────
  const sortMap = {
    'date':       { startDate: 1 },
    'price-asc':  { 'ticketPrice.min': 1, startDate: 1 },
    'price-desc': { 'ticketPrice.min': -1, startDate: 1 },
    'featured':   { isFeatured: -1, startDate: 1 },
  }
  const sortQuery = sortMap[sort] ?? { isFeatured: -1, startDate: 1 }


  const pageNum  = parseInt(page)  || 1
  const limitNum = parseInt(limit) || 10
  const skip     = (pageNum - 1) * limitNum

  const total = await Event.countDocuments(filter)

  // Project only what a listing card needs — keeps payload light
  const events = await Event.find(filter)
    .select('name slug category citySlug heroImage venue.name venue.address startDate endDate isMultiDay ticketPrice isFeatured tags')
    .sort(sortQuery)
    .skip(skip)
    .limit(limitNum)

  res.status(200).json(new ApiResponse(200, {
    events,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: pageNum < Math.ceil(total / limitNum),
      hasPrevPage: pageNum > 1,
    },
  }, 'Events fetched successfully'))
})

export const getEventBySlug = asyncHandler(async (req, res) => {
  const { city, slug } = req.params

  const event = await Event.findOne({ slug, citySlug: city, isActive: true })

  if (!event) {
    throw new ApiError(404, 'Event not found in this city')
  }

  res.status(200).json(new ApiResponse(200, event, 'Event fetched successfully'))
})

export const getFeaturedEvents = asyncHandler(async (req, res) => {
  const { city, limit } = req.query

  const filter = {
    isActive: true,
    isFeatured: true,
    $or: [
      { endDate: { $gte: new Date() } },
      { endDate: { $exists: false } },
    ],
  }

  if (city) filter.citySlug = city

  const events = await Event.find(filter)
    .select('name slug category citySlug heroImage venue.name startDate endDate isMultiDay ticketPrice')
    .sort({ startDate: 1 })
    .limit(parseInt(limit) || 6)

  res.status(200).json(new ApiResponse(200, events, 'Featured events fetched successfully'))
})