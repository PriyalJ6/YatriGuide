import mongoose,{Schema} from "mongoose";

const citySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,       // e.g. "Mumbai"
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,  // e.g. "mumbai" — used in URL /mumbai
    },
    tagline: {
      type: String,     // e.g. "The City of Dreams"
    },
    description: {
      type: String,     // Short intro paragraph shown on city card
    },
    history: {
      type: String,     // Long-form editorial content shown in HistorySection
    },
    heroImage: {
      type: String,     // Cloudinary URL
    },
    images: [
      {
        type: String,   // Additional Cloudinary URLs for gallery
      }
    ],
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
    state: {
      type: String,     // e.g. "Maharashtra"
    },
    country: {
      type: String,
      default: 'India',
    },
    bestTimeToVisit: {
      type: String,     // e.g. "October to March"
    },
    famousFor: [String], // e.g. ["Bollywood", "Beaches", "Nightlife"]
    tags: [String],     // e.g. ["heritage", "coastal", "food"]
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,     // Controls display order on homepage
      default: 0,
    },
  },
  { timestamps: true }
)

citySchema.index({ location: '2dsphere' })

export default mongoose.model('City', citySchema)