import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

dotenv.config()

// Models
import City from '../models/city.models.js'
import Place from '../models/place.models.js'
import Restaurant from '../models/restaurant.models.js'
import Hotel from '../models/hotel.models.js'
import Agency from '../models/agency.models.js'
import Event from '../models/event.models.js'
import Transport from '../models/transport.models.js'
import Shopping from '../models/shopping.models.js'

// ─── Load JSON data files ───────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const dataDir = join(__dirname, 'data')

const readJSON = (filename) => {
  return JSON.parse(readFileSync(join(dataDir, filename), 'utf-8'))
}

const places      = readJSON('places.json')
const restaurants = readJSON('restaurants.json')
const hotels      = readJSON('hotels.json')
const agencies    = readJSON('agencies.json')
const events      = readJSON('events.json')
const transport   = readJSON('transport.json')
const shopping    = readJSON('shopping.json')

// ─── Main seed function ──────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB connected\n')

    // ── Step 1: Clear all collections in reverse dependency order ────────────
    console.log('🗑️  Clearing existing data...')
    await Event.deleteMany({})
    await Transport.deleteMany({})
    await Shopping.deleteMany({})
    await Agency.deleteMany({})
    await Hotel.deleteMany({})
    await Restaurant.deleteMany({})
    await Place.deleteMany({})
    // NOTE: We do NOT delete City here because seedCities.js already ran
    // and inserted cities. Deleting here would break the city ObjectId
    // references. If you want a full reset, uncomment the line below:
    // await City.deleteMany({})
    console.log('✅ Existing data cleared\n')

    // ── Step 2: Get Mumbai's ObjectId from the already-seeded city ───────────
    console.log('🔍 Finding Mumbai city document...')
    const mumbai = await City.findOne({ slug: 'mumbai' })

    if (!mumbai) {
      throw new Error(
        'Mumbai city not found in database. Run seedCities.js first before running this file.'
      )
    }

    const mumbaiId = mumbai._id
    console.log(`✅ Found Mumbai → _id: ${mumbaiId}\n`)

    // ── Step 3: Inject real ObjectId into all documents ──────────────────────
    const placesReady      = places.map(p => ({ ...p, city: mumbaiId }))
    const restaurantsReady = restaurants.map(r => ({ ...r, city: mumbaiId }))
    const hotelsReady      = hotels.map(h => ({ ...h, city: mumbaiId }))
    const agenciesReady    = agencies.map(a => ({ ...a, cities: [mumbaiId] }))
    const eventsReady      = events.map(e => ({ ...e, city: mumbaiId }))
    const transportReady   = transport.map(t => ({ ...t, city: mumbaiId }))
    const shoppingReady    = shopping.map(s => ({ ...s, city: mumbaiId }))

    // ── Step 4: Insert in dependency order ───────────────────────────────────
    console.log('🌱 Seeding collections...\n')

    const insertedPlaces = await Place.insertMany(placesReady)
    console.log(`✅ Places       → ${insertedPlaces.length} documents`)

    const insertedRestaurants = await Restaurant.insertMany(restaurantsReady)
    console.log(`✅ Restaurants  → ${insertedRestaurants.length} documents`)

    const insertedHotels = await Hotel.insertMany(hotelsReady)
    console.log(`✅ Hotels       → ${insertedHotels.length} documents`)

    const insertedAgencies = await Agency.insertMany(agenciesReady)
    console.log(`✅ Agencies     → ${insertedAgencies.length} documents`)

    const insertedEvents = await Event.insertMany(eventsReady)
    console.log(`✅ Events       → ${insertedEvents.length} documents`)

    const insertedTransport = await Transport.insertMany(transportReady)
    console.log(`✅ Transport    → ${insertedTransport.length} documents`)

    const insertedShopping = await Shopping.insertMany(shoppingReady)
    console.log(`✅ Shopping     → ${insertedShopping.length} documents`)

    // ── Step 5: Summary ──────────────────────────────────────────────────────
    console.log('\n─────────────────────────────────────────')
    console.log('🎉 Seed complete! Summary:')
    console.log(`   Cities      → already seeded (not touched)`)
    console.log(`   Places      → ${insertedPlaces.length}`)
    console.log(`   Restaurants → ${insertedRestaurants.length}`)
    console.log(`   Hotels      → ${insertedHotels.length}`)
    console.log(`   Agencies    → ${insertedAgencies.length}`)
    console.log(`   Events      → ${insertedEvents.length}`)
    console.log(`   Transport   → ${insertedTransport.length}`)
    console.log(`   Shopping    → ${insertedShopping.length}`)
    console.log('─────────────────────────────────────────\n')

    process.exit(0)

  } catch (err) {
    console.error('\n❌ Seed failed:', err.message)
    console.error(err)
    process.exit(1)
  }
}

seed()