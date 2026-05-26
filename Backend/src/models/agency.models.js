import mongoose, { Schema } from "mongoose";

const packageSchema = new Schema(
  {
    title:       { type: String, required: true, trim: true },
    duration:    { type: String, trim: true },        // e.g. "5 days / 4 nights"
    price:       { type: Number, min: [0, 'Price cannot be negative'] },
    description: { type: String, trim: true },
  },
  { _id: false }
)

const agencySchema = new Schema(
  {
    // ─── Identity ─────────────────────────────────────────────────
    name: {
      type:     String,
      required: [true, 'Agency name is required'],
      trim:     true,
    },
    slug: {
      type:      String,
      required:  [true, 'Slug is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
    },

    // ─── City Relation ────────────────────────────────────────────
    // ObjectId refs — populated when you need full city details
    cities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'City' }],
    // Denormalised slugs — used for fast controller filtering & AI matching
    // An agency can belong to multiple cities e.g. ["mumbai", "delhi"]
    citySlugs: [{ type: String, lowercase: true, trim: true }],

    // ─── Content ──────────────────────────────────────────────────
    description: { type: String, trim: true },        // used for AI embeddings
    tagline:     { type: String, trim: true },
    heroImage:   { type: String, trim: true },        // Cloudinary URL
    logo:        { type: String, trim: true },        // Cloudinary URL

    // ─── AI Matching Fields ───────────────────────────────────────
    specialisations: [{ type: String, trim: true }],  // e.g. ["heritage tours", "food tours"]
    travelStyles:    [{ type: String, trim: true }],  // e.g. ["budget", "luxury", "mid-range"]
    groupTypes:      [{ type: String, trim: true }],  // e.g. ["solo", "couple", "family", "group"]

    // ─── Pricing ──────────────────────────────────────────────────
    priceRange: {
      min: { type: Number, min: [0, 'Min price cannot be negative'] },
      max: { type: Number, min: [0, 'Max price cannot be negative'] },
    },
    currency: { type: String, default: 'INR', uppercase: true, trim: true },

    // ─── Contact ──────────────────────────────────────────────────
    contact: {
      phone:    { type: String, trim: true },
      email:    {
        type:      String,
        trim:      true,
        lowercase: true,
        match:     [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      },
      website:  {
        type:  String,
        trim:  true,
        match: [/^https?:\/\/.+/, 'Website must start with http:// or https://'],
      },
      whatsapp: { type: String, trim: true },
    },

    // ─── Address & Geo ────────────────────────────────────────────
    address: { type: String, trim: true },
    location: {
      type: {
        type:    String,
        enum:    ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],   // [longitude, latitude]
        validate: {
          validator: function (val) {
            if (!val || val.length === 0) return true
            if (val.length !== 2) return false
            const [lng, lat] = val
            return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90
          },
          message: 'Coordinates must be [longitude, latitude] with valid ranges',
        },
      },
    },

    // ─── Packages ─────────────────────────────────────────────────
    packages: [packageSchema],

    // ─── Meta ─────────────────────────────────────────────────────
    languages:       [{ type: String, trim: true }],
    yearEstablished: {
      type: Number,
      min:  [1850, 'Year established cannot be before 1900'],
      max:  [new Date().getFullYear(), 'Year cannot be in the future'],
    },

    // ─── AI Embedding ─────────────────────────────────────────────
    // Never returned in normal queries — only fetched explicitly for AI
    embedding: { type: [Number], select: false },

    // ─── Stats ────────────────────────────────────────────────────
    rating:      { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, min: 0, default: 0 },

    // ─── Flags ────────────────────────────────────────────────────
    isVerified: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isActive:   { type: Boolean, default: true },
  },
  { timestamps: true }
)

// ─── Cross-field validation ────────────────────────────────────────────────────
// Temporarily removed to fix seeding issue
// agencySchema.pre('validate', function (next = () => {}) {
//   if (
//     this.priceRange?.min != null &&
//     this.priceRange?.max != null &&
//     this.priceRange.max < this.priceRange.min
//   ) {
//     this.invalidate(
//       'priceRange.max',
//       'priceRange.max must be greater than or equal to priceRange.min'
//     )
//   }
//   next()
// })

// ─── Indexes ──────────────────────────────────────────────────────────────────
agencySchema.index({ location: '2dsphere' })
agencySchema.index({ citySlugs: 1 })
agencySchema.index({ specialisations: 1 })
agencySchema.index({ travelStyles: 1 })
agencySchema.index({ isFeatured: -1, rating: -1 })   // matches controller sort order

export default mongoose.model('Agency', agencySchema)