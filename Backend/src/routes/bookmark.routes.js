import { Router } from 'express'
import {
  addBookmark,
  removeBookmark,
  getCollections,
  getCollectionItems,
  moveToCollection,
  renameCollection,
  checkBookmark,
} from '../controllers/bookmark.controllers.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router()

// All bookmark routes require the user to be logged in
router.use(verifyJWT)

// ── Collections overview ──────────────────────
// GET  /api/v1/bookmarks/collections
//   → Returns all collections grouped with their items
router.get('/collections', getCollections)

// ── Single collection ─────────────────────────
// GET  /api/v1/bookmarks/collections/:collectionName
//   → All bookmarks inside one collection
router.get('/collections/:collectionName', getCollectionItems)

// PATCH /api/v1/bookmarks/collections/:collectionName/rename
//   → Rename an entire collection
router.patch('/collections/:collectionName/rename', renameCollection)

// ── Bookmark check ────────────────────────────
// GET  /api/v1/bookmarks/check/:itemId
//   → Is this item bookmarked? Returns { isBookmarked, collectionName }
router.get('/check/:itemId', checkBookmark)

// ── Add / Remove ──────────────────────────────
// POST   /api/v1/bookmarks
//   → Add a bookmark (body: { itemId, itemType, collectionName, snapshot })
router.post('/', addBookmark)

// DELETE /api/v1/bookmarks/:itemId
//   → Remove a bookmark by the original item's ID
router.delete('/:itemId', removeBookmark)

// ── Move between collections ──────────────────
// PATCH  /api/v1/bookmarks/:bookmarkId/move
//   → Move a bookmark to a different collection
router.patch('/:bookmarkId/move', moveToCollection)

export default router