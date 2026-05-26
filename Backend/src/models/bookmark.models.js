import mongoose from 'mongoose'

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'itemType',
    },
    itemType: {
      type: String,
      required: true,
      enum: ['Place', 'Restaurant', 'Hotel', 'Agency', 'Event', 'Transport'],
    },
    // Collection grouping — user can organise bookmarks into named boards
    collectionName: {
      type: String,
      default: 'Saved',
      trim: true,
    },
    collectionEmoji: {
      type: String,
      default: '',
    },
    // Snapshot so the board renders without extra DB joins
    snapshot: {
      name:      { type: String },
      heroImage: { type: String },
      citySlug:  { type: String },
      slug:      { type: String },
    },
  },
  { timestamps: true }
)

// One bookmark per item per user
bookmarkSchema.index({ user: 1, itemId: 1 }, { unique: true })
bookmarkSchema.index({ user: 1, collectionName: 1 })
bookmarkSchema.index({ user: 1, itemType: 1 })

export default mongoose.model('Bookmark', bookmarkSchema)