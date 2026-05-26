import mongoose,{Schema}from 'mongoose'

// Reusable opening hours sub-schema
const openingHoursSchema = new Schema(
  {
    day: { type: String },       // e.g. "Monday–Saturday"
    open: { type: String },      // e.g. "09:00"
    close: { type: String },     // e.g. "18:00"
    isClosed: { type: Boolean, default: false },
    note: { type: String },      // e.g. "Closed on national holidays"
  },
  { _id: false }
)

const placeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,  // e.g. "gateway-of-india" — used in URL
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true,
    },
    citySlug: {
      type: String,     // Denormalised for fast queries — e.g. "mumbai"
    },
    category: {
      type: String,
      enum: ['monument', 'temple', 'museum', 'park', 'beach', 'market', 'neighbourhood', 'viewpoint','heritage','nature',
            'fort','cave','lake','waterfall','island','pilgrimage', 'entertainment','religious-site','other'],
      required: true,
    },
    tagline: {
      type: String,     // One-line emotional hook
    },
    description: {
      type: String,     // Short overview for cards
    },
    history: {
      type: String,     // Long-form editorial — the star of the place detail page
    },
    timeline: [
      {
        year: { type: String },   // e.g. "1924"
        event: { type: String },  // e.g. "Inaugurated by Lord Reading"
        _id: false,
      }
    ],
    heroImage: {
      type: String,     // Cloudinary URL
    },
    images: [String],   // Gallery Cloudinary URLs
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    address: {
      type: String,
    },
    entryFee: {
      indian: { type: Number, default: 0 },       // INR
      foreigner: { type: Number, default: 0 },
      note: { type: String },                      // e.g. "Free on Fridays"
    },
    openingHours: [openingHoursSchema],
    duration: {
      type: String,     // Suggested visit time — e.g. "2–3 hours"
    },
    tags: [String],     // e.g. ["heritage", "UNESCO", "photography"]
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    // Vector embedding stored for AI similarity search
    embedding: {
      type: [Number],
      select: false,    // Not returned in normal queries
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

placeSchema.index({ location: '2dsphere' })
placeSchema.index({ city: 1, isActive: 1 })
placeSchema.index({ citySlug: 1 })

export default mongoose.model('Place', placeSchema)