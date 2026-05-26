import mongoose, { Schema } from 'mongoose'

const shoppingSchema = new Schema(
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
      enum: ['street-market', 'mall', 'bazaar', 'arcade', 'flea-market', 'wholesale-market', 'lane','craft-market','export-surplus','market'],
      required: true,
    },

    // Primary categories this market is known for
    categories: [
      {
        type: String,
        enum: [
          'fashion',
          'street-fashion',
          'ethnic-wear',
          'jewellery',
          'antiques',
          'electronics',
          'books',
          'art',
          'handicrafts',
          'fabrics',
          'leather',
          'footwear',
          'accessories',
          'home-decor',
          'furniture',
          'spices',
          'food',
          'flowers',
          'stationery',
          'toys',
          'sportswear',
          'luggage',
          'wholesale',
          'luxury',
          'export-surplus','bridal-wear','backpacker-shopping','vegetables','international-groceries',
          'vintage'
        ],
      },
    ],

    // What the place is most famous for — short, punchy
    knownFor: { type: String },

    tagline: { type: String },
    description: { type: String },

    heroImage: { type: String },
    images: [String],

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: { type: [Number] }, // [longitude, latitude]
    },
    address: { type: String },
    neighbourhood: { type: String },

    // Approximate spend range per visit (INR)
    budgetRange: {
      min: { type: Number },
      max: { type: Number },
    },

    // Highlights — notable shops / stalls / lanes inside the market
    highlights: [
      {
        name:        { type: String },
        description: { type: String },
      },
    ],

    bestFor: [String],       // e.g. ["Bargain hunters", "Ethnic wear lovers"]
    bestTimeToVisit: { type: String },  // e.g. "Weekday mornings"
    openingHours: { type: String },
    closedOn: { type: String },         // e.g. "Sunday"

    nearestStation: { type: String },   // Nearest local train / metro station
    tips: { type: String },             // Insider tips paragraph

    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, default: 0 },

    isFeatured: { type: Boolean, default: false },
    isActive:   { type: Boolean, default: true },
  },
  { timestamps: true }
)

shoppingSchema.index({ location: '2dsphere' })
shoppingSchema.index({ citySlug: 1, isActive: 1 })
shoppingSchema.index({ categories: 1 })

export default mongoose.model('Shopping', shoppingSchema)