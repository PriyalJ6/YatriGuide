import mongoose from "mongoose";
import City from "../../models/city.models.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../../.env") });

async function seedCities() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await City.deleteMany();

    const cities = [
      {
        name: "Mumbai",
        slug: "mumbai",
        tagline: "The City of Dreams",
        description:
          "Mumbai is India's financial capital and entertainment hub — a city of relentless energy, extraordinary contrasts, and the best street food on earth. From the colonial grandeur of the Fort precinct to the neon chaos of Dharavi, from Juhu Beach at sunrise to the Queen's Necklace at midnight, Mumbai rewards everyone who gives it time.",
        state: "Maharashtra",
        country: "India",
        heroImage: "",
        images: [],
        location: {
          type: "Point",
          coordinates: [72.8777, 19.076],
        },
        famousFor: [
          "Bollywood",
          "Street Food",
          "Colonial Architecture",
          "Marine Drive",
          "Gateway of India",
          "Dharavi",
          "Nightlife",
        ],
        tags: ["metro", "coastal", "food", "heritage", "nightlife", "finance"],
        bestTimeToVisit: "November to February",
        language: ["Marathi", "Hindi", "English"],
        currency: "INR",
        timezone: "Asia/Kolkata",
        airport: {
          name: "Chhatrapati Shivaji Maharaj International Airport",
          iata: "BOM",
          distanceFromCentre: "28 km from South Mumbai",
        },
        isFeatured: true,
        isActive: true,
      },

      {
        name: "Delhi",
        slug: "delhi",
        tagline: "The Capital of Empires",
        description:
          "Delhi is India's capital and its most historically layered city — a place where seven successive empires have built and buried one another, leaving behind a palimpsest of monuments, markets, and memories that no other city on earth can match. From the Mughal grandeur of the Red Fort and Humayun's Tomb to the colonial geometry of Lutyens' New Delhi, from the spice mountains of Khari Baoli to the galleries of Mehrauli, Delhi is simultaneously the oldest and most modern metropolis in South Asia. It is a city that demands patience and rewards it enormously.",
        state: "Delhi (NCT)",
        country: "India",
        heroImage: "",
        images: [],
        location: {
          type: "Point",
          coordinates: [77.209, 28.6139],
        },
        famousFor: [
          "Mughal Monuments",
          "Red Fort",
          "Humayun's Tomb",
          "Qutb Minar",
          "Old Delhi",
          "Street Food",
          "Chandni Chowk",
          "Lutyens Bungalow Zone",
        ],
        tags: [
          "metro",
          "heritage",
          "Mughal",
          "food",
          "history",
          "capital",
          "culture",
          "UNESCO",
        ],
        bestTimeToVisit: "October to March",
        language: ["Hindi", "Punjabi", "Urdu", "English"],
        currency: "INR",
        timezone: "Asia/Kolkata",
        airport: {
          name: "Indira Gandhi International Airport",
          iata: "DEL",
          distanceFromCentre: "16 km from Connaught Place",
        },
        isFeatured: true,
        isActive: true,
      },
    ];

    const inserted = await City.insertMany(cities);

    console.log("✅ Cities seeded successfully:");
    inserted.forEach((city) => {
      console.log(`  → ${city.name} | slug: ${city.slug} | _id: ${city._id}`);
    });

    console.log("\n⚠️  IMPORTANT: Copy the Delhi _id above.");
    console.log(
      "   Replace DELHI_CITY_ID in all Delhi seed files with that value.\n"
    );

    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedCities();