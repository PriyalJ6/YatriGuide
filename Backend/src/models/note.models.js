import mongoose from 'mongoose';

// Powers the Journal tab in the personalised section.
// A note can be a place review, a diary entry, or a trip tip.
// Optionally linked to a Place or a SavedTrip.

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },

    // "place"  = a review or tip about a specific place (tag: place note)
    // "diary"  = a personal travel diary entry (tag: diary)
    type: {
      type: String,
      enum: ['place', 'diary'],
      default: 'diary',
    },

    // Optional — link note to a place in your DB
    linkedPlace: {
      placeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
      },
      name:     { type: String },
      slug:     { type: String },
      citySlug: { type: String },
    },

    // Optional — link note to one of the user's saved trips
    linkedTrip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SavedTrip',
    },

    // For AI feature (phase 2): "expand this note into a blog post"
    // Stores the AI-expanded version so it's not regenerated every time
    aiExpanded: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
)

noteSchema.index({ user: 1 })
noteSchema.index({ user: 1, type: 1 })
noteSchema.index({ user: 1, 'linkedPlace.placeId': 1 })
noteSchema.index({ user: 1, linkedTrip: 1 })

export default mongoose.model('Note', noteSchema)