import { Router } from 'express'
import {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  addOrUpdateDay,
  removeDay,
  deleteTrip,
} from '../controllers/savedTrip.controllers.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router()

// All trip routes require the user to be logged in
router.use(verifyJWT)

// ── Trip CRUD ─────────────────────────────────
// POST   /api/v1/trips         → Create a trip (manual or AI)
// GET    /api/v1/trips         → Get all user's trips (?source=manual|ai)
router.route('/').post(createTrip).get(getUserTrips)

// GET    /api/v1/trips/:tripId → Single trip with full itinerary
// PATCH  /api/v1/trips/:tripId → Update title, dates, progress
// DELETE /api/v1/trips/:tripId → Delete trip
router.route('/:tripId').get(getTripById).patch(updateTrip).delete(deleteTrip)

// ── Itinerary day management ──────────────────
// PATCH  /api/v1/trips/:tripId/day
//   → Add or replace a day (body: { day, title, narrative, places })
router.patch('/:tripId/day', addOrUpdateDay)

// DELETE /api/v1/trips/:tripId/day/:dayNumber
//   → Remove a specific day from the itinerary
router.delete('/:tripId/day/:dayNumber', removeDay)

export default router