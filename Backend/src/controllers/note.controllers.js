import Note from '../models/note.models.js'
import { ApiError } from '../utils/api-error.js'
import { ApiResponse } from '../utils/api-response.js'
import { asyncHandler } from '../utils/async-handler.js'

// POST /api/v1/notes
export const createNote = asyncHandler(async (req, res) => {
  const { title, body, type, linkedPlace, linkedTrip } = req.body

  if (!title || !body) {
    throw new ApiError(400, 'Title and body are required')
  }

  const note = await Note.create({
    user:        req.user._id,
    title,
    body,
    type:        type        || 'diary',
    linkedPlace: linkedPlace || undefined,
    linkedTrip:  linkedTrip  || undefined,
  })

  res.status(201).json(new ApiResponse(201, note, 'Note created'))
})

// GET /api/v1/notes?type=place|diary&linkedTrip=<id>&linkedPlace=<id>&page=1&limit=10
export const getUserNotes = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id }

  if (req.query.type)        filter.type                   = req.query.type
  if (req.query.linkedTrip)  filter.linkedTrip             = req.query.linkedTrip
  if (req.query.linkedPlace) filter['linkedPlace.placeId'] = req.query.linkedPlace

  const pageNum  = parseInt(req.query.page)  || 1
  const limitNum = parseInt(req.query.limit) || 10
  const skip     = (pageNum - 1) * limitNum

  const total = await Note.countDocuments(filter)

  const notes = await Note.find(filter)
    .select('-aiExpanded')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean()

  res.status(200).json(new ApiResponse(200, {
    notes,
    pagination: {
      total,
      page:        pageNum,
      limit:       limitNum,
      totalPages:  Math.ceil(total / limitNum),
      hasNextPage: pageNum < Math.ceil(total / limitNum),
      hasPrevPage: pageNum > 1,
    },
  }, 'Notes fetched'))
})

// GET /api/v1/notes/:noteId
export const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findOne({
    _id:  req.params.noteId,
    user: req.user._id,
  }).lean()

  if (!note) {
    throw new ApiError(404, 'Note not found')
  }

  res.status(200).json(new ApiResponse(200, note, 'Note fetched'))
})

// PATCH /api/v1/notes/:noteId
export const updateNote = asyncHandler(async (req, res) => {
  const allowed = ['title', 'body', 'type', 'linkedPlace', 'linkedTrip']
  const updates = {}

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key]
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, 'No valid fields to update')
  }

  const note = await Note.findOneAndUpdate(
    { _id: req.params.noteId, user: req.user._id },
    updates,
    { new: true }
  )

  if (!note) {
    throw new ApiError(404, 'Note not found')
  }

  res.status(200).json(new ApiResponse(200, note, 'Note updated'))
})

// DELETE /api/v1/notes/:noteId
export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({
    _id:  req.params.noteId,
    user: req.user._id,
  })

  if (!note) {
    throw new ApiError(404, 'Note not found')
  }

  res.status(200).json(new ApiResponse(200, null, 'Note deleted'))
})