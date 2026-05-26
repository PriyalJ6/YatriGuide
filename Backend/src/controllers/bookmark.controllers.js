import Bookmark from '../models/bookmark.models.js'
import mongoose from 'mongoose'
import { ApiError } from '../utils/api-error.js'
import { ApiResponse } from '../utils/api-response.js'
import { asyncHandler } from '../utils/async-handler.js'

// POST /api/v1/bookmarks
export const addBookmark = asyncHandler(async (req, res) => {
  const { itemId, itemType, collectionName, collectionEmoji, snapshot } = req.body

  if (!itemId || !itemType) {
    throw new ApiError(400, 'itemId and itemType are required')
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, 'Invalid itemId format')
  }

  const itemObjectId = new mongoose.Types.ObjectId(itemId)

  const bookmark = await Bookmark.findOneAndUpdate(
    { user: req.user._id, itemId: itemObjectId },
    {
      user: req.user._id,
      itemId: itemObjectId,
      itemType,
      collectionName:  collectionName  || 'Saved',
      collectionEmoji: collectionEmoji || '',
      snapshot:        snapshot        || {},
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )

  res.status(201).json(new ApiResponse(201, bookmark, 'Bookmark added'))
})

// DELETE /api/v1/bookmarks/:itemId
export const removeBookmark = asyncHandler(async (req, res) => {
  const { itemId } = req.params

  const itemObjectId = new mongoose.Types.ObjectId(itemId)

  const bookmark = await Bookmark.findOneAndDelete({
    user: req.user._id,
    itemId: itemObjectId,
  })

  if (!bookmark) {
    throw new ApiError(404, 'Bookmark not found')
  }

  res.status(200).json(new ApiResponse(200, null, 'Bookmark removed'))
})

// GET /api/v1/bookmarks/collections?page=1&limit=10
export const getCollections = asyncHandler(async (req, res) => {
  const pageNum  = parseInt(req.query.page)  || 1
  const limitNum = parseInt(req.query.limit) || 10
  const skip     = (pageNum - 1) * limitNum

  const bookmarks = await Bookmark.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .lean()

  // Build collection map from all bookmarks (grouping must happen on full set)
  const collectionMap = {}

  for (const bm of bookmarks) {
    const key = bm.collectionName || 'Saved'

    if (!collectionMap[key]) {
      collectionMap[key] = {
        collectionName:  key,
        collectionEmoji: bm.collectionEmoji || '',
        count: 0,
        items: [],
      }
    }

    collectionMap[key].count += 1
    collectionMap[key].items.push({
      _id:       bm._id,
      itemId:    bm.itemId,
      itemType:  bm.itemType,
      snapshot:  bm.snapshot,
      createdAt: bm.createdAt,
    })
  }

  const allCollections = Object.values(collectionMap)
  const total          = allCollections.length
  const collections    = allCollections.slice(skip, skip + limitNum)

  res.status(200).json(new ApiResponse(200, {
    collections,
    pagination: {
      total,
      page:        pageNum,
      limit:       limitNum,
      totalPages:  Math.ceil(total / limitNum),
      hasNextPage: pageNum < Math.ceil(total / limitNum),
      hasPrevPage: pageNum > 1,
    },
  }, 'Collections fetched'))
})

// GET /api/v1/bookmarks/collections/:collectionName?page=1&limit=10
export const getCollectionItems = asyncHandler(async (req, res) => {
  const { collectionName } = req.params
  const pageNum  = parseInt(req.query.page)  || 1
  const limitNum = parseInt(req.query.limit) || 10
  const skip     = (pageNum - 1) * limitNum

  const filter = {
    user:           req.user._id,
    collectionName: decodeURIComponent(collectionName),
  }

  const total = await Bookmark.countDocuments(filter)

  const items = await Bookmark.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean()

  res.status(200).json(new ApiResponse(200, {
    items,
    pagination: {
      total,
      page:        pageNum,
      limit:       limitNum,
      totalPages:  Math.ceil(total / limitNum),
      hasNextPage: pageNum < Math.ceil(total / limitNum),
      hasPrevPage: pageNum > 1,
    },
  }, 'Collection items fetched'))
})

// PATCH /api/v1/bookmarks/:bookmarkId/move
export const moveToCollection = asyncHandler(async (req, res) => {
  const { bookmarkId } = req.params
  const { collectionName, collectionEmoji } = req.body

  if (!collectionName) {
    throw new ApiError(400, 'collectionName is required')
  }

  const bookmark = await Bookmark.findOneAndUpdate(
    { _id: bookmarkId, user: req.user._id },
    { collectionName, collectionEmoji: collectionEmoji || '' },
    { new: true }
  )

  if (!bookmark) {
    throw new ApiError(404, 'Bookmark not found')
  }

  res.status(200).json(new ApiResponse(200, bookmark, 'Moved to collection'))
})

// PATCH /api/v1/bookmarks/collections/:collectionName/rename
export const renameCollection = asyncHandler(async (req, res) => {
  const { collectionName } = req.params
  const { newName, newEmoji } = req.body

  if (!newName) {
    throw new ApiError(400, 'newName is required')
  }

  const result = await Bookmark.updateMany(
    { user: req.user._id, collectionName: decodeURIComponent(collectionName) },
    { collectionName: newName, ...(newEmoji !== undefined && { collectionEmoji: newEmoji }) }
  )

  res.status(200).json(new ApiResponse(200, { modifiedCount: result.modifiedCount }, 'Collection renamed'))
})

// GET /api/v1/bookmarks/check/:itemId
export const checkBookmark = asyncHandler(async (req, res) => {
  const { itemId } = req.params

  const bookmark = await Bookmark.findOne({
    user: req.user._id,
    itemId,
  }).lean()

  res.status(200).json(new ApiResponse(200, {
    isBookmarked:   !!bookmark,
    collectionName: bookmark?.collectionName || null,
  }, 'Bookmark status checked'))
})




