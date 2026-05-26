import mongoose,{Schema} from 'mongoose'

const eventSchema = new Schema(
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
      lowercase: true,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true,
    },
    citySlug: { type: String },

    category: {
      type: String,
      enum: ['concert', 'festival', 'exhibition', 'food', 'sports', 'comedy', 'theatre', 'workshop', 'other'],
    },
    description: { type: String },
    heroImage: { type: String },

    venue: {
      name: { type: String },
      address: { type: String },
      location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: { type: [Number] },  // [longitude, latitude]
      },
    },

    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isMultiDay: { type: Boolean, default: false },

    ticketPrice: {
      min: { type: Number },
      max: { type: Number },
      isFree: { type: Boolean, default: false },
    },
    bookingUrl: { type: String },   // BookMyShow or direct link

    // For events pulled from BookMyShow API
    externalId: { type: String },   // BookMyShow event ID
    source: {
      type: String,
      enum: ['manual', 'bookmyshow'],
      default: 'manual',
    },

    tags: [String],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

eventSchema.index({ city: 1, startDate: 1 })
eventSchema.index({ citySlug: 1, startDate: 1 })
eventSchema.index({ startDate: 1 })

export default mongoose.model('Event', eventSchema)