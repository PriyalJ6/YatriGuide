import { Router } from 'express'
import {
  createNote,
  getUserNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from '../controllers/note.controllers.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router()

// All note routes require the user to be logged in
router.use(verifyJWT)

// POST   /api/v1/notes         → Create a note
// GET    /api/v1/notes         → Get all notes (?type=place|diary &linkedTrip= &linkedPlace=)
router.route('/').post(createNote).get(getUserNotes)

// GET    /api/v1/notes/:noteId → Single note
// PATCH  /api/v1/notes/:noteId → Update note
// DELETE /api/v1/notes/:noteId → Delete note
router.route('/:noteId').get(getNoteById).patch(updateNote).delete(deleteNote)

export default router