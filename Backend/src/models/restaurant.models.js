import mongoose,{Schema} from "mongoose";

const restaurantSchema = new Schema(
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

    cuisine: [String],            // e.g. ["Mughlai", "North Indian"]
    category: {
      type: String,
      enum: ['fine-dining', 'casual', 'street-food', 'cafe', 'bakery', 'bar', 'dhaba', 'other'],
    },
    tagline: { type: String },    // e.g. "Mumbai's oldest Irani café"
    description: { type: String },

    priceRange: {
      type: String,
      enum: ['₹', '₹₹', '₹₹₹', '₹₹₹₹'],  // budget to luxury
    },
    avgCostForTwo: { type: Number },       // INR

    heroImage: { type: String },
    images: [String],

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: { type: [Number] },     // [longitude, latitude]
    },
    address: { type: String },
    neighbourhood: { type: String },       // e.g. "Bandra West"

    openingHours: [
      {
        day: { type: String },
        open: { type: String },
        close: { type: String },
        isClosed: { type: Boolean, default: false },
        _id: false,
      }
    ],

    mustTry: [String],                     // Dish names — e.g. ["Bun Maska", "Irani Chai"]
    features: [String],                    // e.g. ["Outdoor seating", "Live music", "Vegan options"]
    googleMapsUrl: { type: String },

    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, default: 0 },

    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

restaurantSchema.index({ location: '2dsphere' })
restaurantSchema.index({ city: 1, isActive: 1 })
restaurantSchema.index({ citySlug: 1 })

export default mongoose.model('Restaurant', restaurantSchema)