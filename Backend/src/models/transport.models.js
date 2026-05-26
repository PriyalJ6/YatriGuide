import mongoose,{Schema} from  "mongoose";

// Each document = one transport option within a city
// e.g. "Mumbai Local Train", "Delhi Metro", "Auto Rickshaw in Hyderabad"

const transportSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,       // e.g. "Mumbai Local Train"
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,  // e.g. "mumbai-local-train"
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true,
    },
    citySlug: { type: String },

    type: {
      type: String,
      required: true,
      enum: [
        'local-train',
        'metro',
        'bus',
        'auto-rickshaw',
        'taxi',
        'cab',           // Ola/Uber
        'ferry',
        'monorail',
        'tram',
        'cycle-rickshaw',
        'airport-transfer',
        'inter-city-bus',
        'rapid-rail',
        'intercity-bus',
        'train',
        'tourist-bus',
        'other',
      ],
    },

    description: {
      type: String,     // Overview paragraph shown on transport card
    },
    tips: [String],     // Practical tips — e.g. "Avoid peak hours 8–10am", "Buy a day pass"

    heroImage: { type: String },  // Cloudinary URL
    images: [String],

    // Fare info — keep flexible since every city/mode is different
    fare: {
      min: { type: Number },        // INR — cheapest possible fare
      max: { type: Number },        // INR — max typical fare
      unit: {
        type: String,               // e.g. "per km", "per ride", "per day pass"
        default: 'per ride',
      },
      note: { type: String },       // e.g. "AC buses cost ₹5 extra"
    },

    // Key routes or lines — optional, useful for metro/train
    routes: [
      {
        name: { type: String },     // e.g. "Western Line", "Blue Line"
        from: { type: String },     // e.g. "Churchgate"
        to: { type: String },       // e.g. "Virar"
        note: { type: String },
        _id: false,
      }
    ],

    // How to pay
    paymentMethods: [String],       // e.g. ["Cash", "UPI", "Metro Card", "NCMC Card"]

    // Availability
    operatingHours: {
      open: { type: String },       // e.g. "05:00"
      close: { type: String },      // e.g. "23:30"
      note: { type: String },       // e.g. "24x7 for airport cabs"
    },
    frequency: {
      type: String,                 // e.g. "Every 3–5 minutes during peak hours"
    },

    // Accessibility & features
    features: [String],             // e.g. ["AC", "Women-only coach", "Wheelchair accessible"]

    // Useful apps or links
    apps: [
      {
        name: { type: String },     // e.g. "Ola", "Mumbai Rail Map"
        url: { type: String },
        _id: false,
      }
    ],

    // For airport-specific transport — mark which airports it serves
    servesAirport: { type: Boolean, default: false },

    order: { type: Number, default: 0 },  // Display order on the transport page
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

transportSchema.index({ city: 1, type: 1 })
transportSchema.index({ citySlug: 1 })

export default mongoose.model('Transport', transportSchema)