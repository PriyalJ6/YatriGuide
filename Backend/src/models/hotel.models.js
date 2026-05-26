import mongoose,{Schema} from "mongoose";

const hotelSchema = new Schema(
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

    type: {
      type: String,
      enum: ['hotel', 'boutique', 'hostel', 'resort', 'homestay', 'heritage', 'apartment'],
    },
    stars: {
      type: Number,
      min: 1,
      max: 5,
    },

    tagline: { type: String },
    description: { type: String },
    knownFor: { type: String },     // One-liner: e.g. "Sea-facing rooms and colonial charm"

    heroImage: { type: String },
    images: [String],

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: { type: [Number] },  // [longitude, latitude]
    },
    address: { type: String },
    neighbourhood: { type: String },

    priceRange: {
      min: { type: Number },    // Per night INR
      max: { type: Number },
    },

    amenities: [String],        // e.g. ["Pool", "Gym", "Free WiFi", "Restaurant"]
    bookingUrl: { type: String },

    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, default: 0 },

    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

hotelSchema.index({ location: '2dsphere' })
hotelSchema.index({ city: 1, isActive: 1 })
hotelSchema.index({ citySlug: 1 })

export default mongoose.model('Hotel', hotelSchema)