// ─────────────────────────────────────────────────────────────────────────────
// resetHotelRestaurant.js
// Deletes hotel + restaurant images from Cloudinary
// and resets heroImage to "" in MongoDB
//
// Usage: node resetHotelRestaurant.js
// ─────────────────────────────────────────────────────────────────────────────
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const Hotel      = (await import("../../models/hotel.models.js")).default;
const Restaurant = (await import("../../models/restaurant.models.js")).default;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ── Delete all files inside a Cloudinary folder ───────────────────────────────
const deleteCloudinaryFolder = async (folder) => {
  console.log(`  🗑️   Cloudinary: yatriguide/${folder}/`);
  try {
    const result = await cloudinary.api.delete_resources_by_prefix(`yatriguide/${folder}/`);
    const count  = Object.keys(result.deleted || {}).length;
    console.log(`       → ${count} file(s) deleted`);
    await cloudinary.api.delete_folder(`yatriguide/${folder}`).catch(() => {});
  } catch (err) {
    if (err?.error?.http_code === 404 || err?.http_code === 404) {
      console.log(`       → folder not found, skipping`);
    } else {
      console.log(`       → error: ${err.message}`);
    }
  }
  await sleep(500);
};

// ── Clear heroImage field in MongoDB ─────────────────────────────────────────
const clearMongo = async (Model, label) => {
  const result = await Model.updateMany({}, { $set: { heroImage: "" } });
  console.log(`  🗄️   MongoDB ${label}: ${result.modifiedCount} docs reset`);
};

// ── Main ──────────────────────────────────────────────────────────────────────
const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅  MongoDB connected\n");

  console.log("── STEP 1: Delete images from Cloudinary ────────────────────");
  await deleteCloudinaryFolder("hotels");
  await deleteCloudinaryFolder("restaurants");

  console.log("\n── STEP 2: Reset heroImage to '' in MongoDB ─────────────────");
  await clearMongo(Hotel,      "Hotels");
  await clearMongo(Restaurant, "Restaurants");

  console.log("\n✅  Done — Cloudinary cleaned + MongoDB heroImages reset");
  await mongoose.disconnect();
};

run().catch(err => { console.error(err); process.exit(1); });