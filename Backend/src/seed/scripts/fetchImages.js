// ─────────────────────────────────────────────────────────────────────────────
// seedImages.js — YatriGuide Image Seeder v8
//
// Strategy (in order):
//   1. Serper.dev Google Images API  → real Google Image results (2500 free)
//   2. Wikipedia API                 → real photo of exact place (free)
//   3. Wikimedia Commons             → additional free fallback (free)
//   4. Apify Google Maps             → real Google Maps business photos
//
// Usage: node seedImages.js
// Requires in .env:
//   SERPER_API_KEY
//   APIFY_API_TOKEN
//   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
//   MONGODB_URI
// ─────────────────────────────────────────────────────────────────────────────

import "dotenv/config";
import mongoose from "mongoose";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const Event      = (await import("../../models/event.models.js")).default;
const Hotel      = (await import("../../models/hotel.models.js")).default;
const Restaurant = (await import("../../models/restaurant.models.js")).default;
const Shopping   = (await import("../../models/shopping.models.js")).default;
const Transport  = (await import("../../models/transport.models.js")).default;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SERPER_KEY  = process.env.SERPER_API_KEY;
const APIFY_TOKEN = process.env.APIFY_API_TOKEN;

// ─────────────────────────────────────────────────────────────────────────────
// Shared headers for Wikipedia & Commons
// Both APIs REQUIRE a descriptive User-Agent or they return 403
// ─────────────────────────────────────────────────────────────────────────────
const WIKI_HEADERS = {
  "User-Agent": "YatriGuide/1.0 (travel guide app; contact@yatriguide.com)",
  "Accept":     "application/json",
};

// ─────────────────────────────────────────────────────────────────────────────
// STRATEGY 1 — Serper.dev Google Images
// Searches Google Images and returns real image URLs
// Much better than Unsplash — returns actual photos of the exact place
// ─────────────────────────────────────────────────────────────────────────────
const getSerperImage = async (query) => {
  try {
    console.log(`     🔎 Serper Google Images: "${query}"`);

    const res = await axios.post(
      "https://google.serper.dev/images",
      { q: query, num: 10, gl: "in", hl: "en" },  // num:10 gives more to filter from
      {
        headers: {
          "X-API-KEY":    SERPER_KEY,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    const images = res.data?.images;
    if (!images?.length) {
      console.log(`     ⚠️  Serper: no images found`);
      return null;
    }

    // Domains that block hotlinking or rate limit heavily — skip these
    const blockedDomains = [
      "wikimedia.org",
      "wikipedia.org",
      "instagram.com",
      "lookaside.instagram.com",
      "lookaside.fbsbx.com",
      "facebook.com",
      "fbcdn.net",
      "coliseum-online.com",
      "shanmukhananda.com",  // blocks direct image access
    ];

    const validImages = images.filter((img) => {
      const url = img.imageUrl || img.thumbnailUrl || "";
      if (!url) return false;
      if (url.endsWith(".svg")) return false;
      if (url.includes("logo")) return false;
      // Skip all blocked domains
      const isBlocked = blockedDomains.some((domain) => url.includes(domain));
      return !isBlocked;
    });

    if (!validImages.length) {
      console.log(`     ⚠️  Serper: no valid images after filtering`);
      return null;
    }

    // Pick first valid image — Serper returns results sorted by relevance
    const best = validImages[0];
    const imageUrl = best.imageUrl || best.thumbnailUrl;

    console.log(`     ✅ Serper: found → ${best.title || "image"}`);
    return imageUrl;

  } catch (err) {
    console.log(`     ⚠️  Serper error: ${err.message}`);
    return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// STRATEGY 2 — Wikipedia API
// Gets the main lead image from the Wikipedia page for this place
// ─────────────────────────────────────────────────────────────────────────────
const getWikipediaImage = async (query) => {
  try {
    const searchRes = await axios.get("https://en.wikipedia.org/w/api.php", {
      params: {
        action:   "query",
        list:     "search",
        srsearch: query,
        srlimit:  3,
        format:   "json",
        origin:   "*",
      },
      headers: WIKI_HEADERS,
      timeout: 10000,
    });

    const results = searchRes.data?.query?.search;
    if (!results?.length) return null;

    for (const result of results) {
      const imgRes = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action:   "query",
          titles:   result.title,
          prop:     "pageimages",
          piprop:   "original",
          format:   "json",
          origin:   "*",
        },
        headers: WIKI_HEADERS,
        timeout: 10000,
      });

      const page = Object.values(imgRes.data?.query?.pages || {})[0];
      if (page?.original?.source) {
        console.log(`     ✅ Wikipedia: "${result.title}"`);
        return page.original.source;
      }
    }

    return null;
  } catch (err) {
    console.log(`     Wikipedia error: ${err.message}`);
    return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// STRATEGY 3 — Wikimedia Commons
// Extra fallback — searches Commons for images matching the place name
// ─────────────────────────────────────────────────────────────────────────────
const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "");

const isRelevant = (title, query) => {
  const t = normalize(title);
  const q = normalize(query);
  return q.split(" ").every((w) => t.includes(w));
};

const getCommonsImage = async (query) => {
  try {
    const res = await axios.get("https://commons.wikimedia.org/w/api.php", {
      params: {
        action:       "query",
        generator:    "search",
        gsrnamespace: 6,
        gsrsearch:    `${query} filetype:bitmap`,
        gsrlimit:     5,
        prop:         "imageinfo",
        iiprop:       "url",
        iiurlwidth:   1200,
        format:       "json",
        origin:       "*",
      },
      headers: WIKI_HEADERS,
      timeout: 10000,
    });

    const pages = res.data?.query?.pages;
    if (!pages) return null;

    const images = Object.values(pages)
      .filter((p) => isRelevant(p.title, query))
      .map((p) => p.imageinfo?.[0]?.thumburl)
      .filter(Boolean);

    if (images[0]) console.log(`     ✅ Wikimedia Commons: image found`);
    return images[0] || null;
  } catch (err) {
    console.log(`     Commons error: ${err.message}`);
    return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// STRATEGY 4 — Apify Google Maps Photos
// Uses compass~crawler-google-places to get real Google Maps business photos
// Best fallback — actual photos uploaded by the business owners themselves
// ─────────────────────────────────────────────────────────────────────────────
const getApifyGoogleMapsPhoto = async (name, city) => {
  try {
    const searchQuery = `${name} ${city} India`;
    console.log(`     🗺️  Apify Google Maps: "${searchQuery}"`);

    const runRes = await axios.post(
      `https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=60`,
      {
        searchStringsArray: [searchQuery],
        maxCrawledPlaces:   1,
        includeImages:      true,
        maxImages:          1,
        language:           "en",
      },
      {
        timeout: 90000,
        headers: { "Content-Type": "application/json" },
      }
    );

    const items = runRes.data;
    if (!items?.length) {
      console.log(`     ⚠️  Apify: no results`);
      return null;
    }

    const place    = items[0];
    const photoUrl =
      place?.images?.[0]?.imageUrl ||
      place?.images?.[0]?.url      ||
      place?.imageUrls?.[0]        ||
      null;

    if (!photoUrl) {
      console.log(`     ⚠️  Apify: no photo URL in result`);
      return null;
    }

    console.log(`     ✅ Apify: photo found!`);
    return photoUrl;

  } catch (err) {
    console.log(`     ⚠️  Apify error: ${err.message}`);
    return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// BUILD SEARCH QUERIES
// For events → use venue name (venues exist on Google, event names often don't)
// ─────────────────────────────────────────────────────────────────────────────
const buildQueries = (item, modelName) => {
  const city = item.citySlug || "India";

  switch (modelName) {
    case "hotels":
      return {
        serper:    `${item.name} hotel ${city} India`,
        wikipedia: `${item.name} hotel ${city}`,
        commons:   `${item.name} ${city}`,
      };

    case "restaurants":
      return {
        serper:    `${item.name} restaurant ${city} India`,
        wikipedia: `${item.name} restaurant ${city}`,
        commons:   `${item.name} ${city}`,
      };

    case "events": {
      // Use venue name for events — much better Google Images results
      // But if venue is TBC/unknown, fall back to event name + category keyword
      const tbcNames = [
        "Venue To Be Announced",
        "Venue TBC, Delhi NCR",
        "Various Heritage Locations, Mumbai",
      ];
      const venueName =
        item.venue?.name && !tbcNames.includes(item.venue.name)
          ? item.venue.name
          : item.name;

      // For concert/EDM events with TBC venue, add genre keyword for better image
      const category = item.category || "";
      const suffix = tbcNames.includes(item.venue?.name)
        ? ` ${category} concert`
        : "";

      return {
        serper:    `${venueName}${suffix} ${city} India`,
        wikipedia: `${venueName} ${city}`,
        commons:   `${venueName} ${city}`,
      };
    }

    case "shopping":
      return {
        serper:    `${item.name} ${city} India`,
        wikipedia: `${item.name} ${city}`,
        commons:   `${item.name} ${city}`,
      };

    case "transport":
      return {
        serper:    `${item.name} ${city} India`,
        wikipedia: `${item.name} ${city}`,
        commons:   `${item.name} ${city}`,
      };

    default:
      return {
        serper:    `${item.name} ${city} India`,
        wikipedia: `${item.name} ${city}`,
        commons:   `${item.name} ${city}`,
      };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// MASTER — Try all 4 strategies in order
// ─────────────────────────────────────────────────────────────────────────────
const getImage = async (item, modelName) => {
  const city    = item.citySlug || "India";
  const queries = buildQueries(item, modelName);

  // 1. Serper Google Images — best & most accurate
  console.log(`\n     [1/4] Trying Serper Google Images...`);
  const serperImage = await getSerperImage(queries.serper);
  if (serperImage) return { url: serperImage, source: "google-images (serper)" };

  await sleep(500);

  // 2. Wikipedia — great for famous landmarks
  console.log(`     [2/4] Trying Wikipedia...`);
  const wikiImage = await getWikipediaImage(queries.wikipedia);
  if (wikiImage) return { url: wikiImage, source: "wikipedia" };

  await sleep(300);

  // 3. Wikimedia Commons — extra fallback
  console.log(`     [3/4] Trying Wikimedia Commons...`);
  const commonsImage = await getCommonsImage(queries.commons);
  if (commonsImage) return { url: commonsImage, source: "commons" };

  await sleep(300);

  // 4. Apify Google Maps — real business photos as last resort
  console.log(`     [4/4] Trying Apify Google Maps...`);
  const apifyImage = await getApifyGoogleMapsPhoto(queries.serper.replace(" India", ""), city);
  if (apifyImage) return { url: apifyImage, source: "google-maps (apify)" };

  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Upload to Cloudinary
// ─────────────────────────────────────────────────────────────────────────────
const uploadToCloudinary = async (imageUrl, folder, slug) => {
  const result = await cloudinary.uploader.upload(imageUrl, {
    folder:         `yatriguide/${folder}`,
    public_id:      slug,
    overwrite:      true,
    transformation: [
      { width: 1200, height: 800, crop: "fill", gravity: "auto" },
      { quality: "auto", fetch_format: "auto" },
    ],
  });
  return result.secure_url;
};

// ─────────────────────────────────────────────────────────────────────────────
// Process one model
// ─────────────────────────────────────────────────────────────────────────────
const processModel = async (Model, folderName) => {
  const items = await Model.find({
    $or: [
      { heroImage: "" },
      { heroImage: null },
      { heroImage: { $exists: false } },
    ],
  });

  console.log(`\n${"─".repeat(60)}`);
  console.log(`📦  ${folderName.toUpperCase()}: ${items.length} items`);
  console.log(`${"─".repeat(60)}`);

  let ok = 0, skip = 0, fail = 0;
  const sourceCount = {};

  for (const item of items) {
    console.log(`\n  📍 ${item.name} (${item.citySlug})`);

    try {
      const result = await getImage(item, folderName);

      if (!result) {
        console.log(`  ⚠️  SKIPPED — no image found from any source`);
        skip++;
        await sleep(500);
        continue;
      }

      const cloudinaryUrl = await uploadToCloudinary(
        result.url, folderName, item.slug
      );
      await Model.findByIdAndUpdate(item._id, { heroImage: cloudinaryUrl });

      console.log(`  ✅  [${result.source}] → ${cloudinaryUrl}`);
      ok++;
      sourceCount[result.source] = (sourceCount[result.source] || 0) + 1;

    } catch (err) {
      console.log(`  ❌  FAILED: ${err.message}`);
      fail++;
    }

    // Gap between items — keeps Serper rate limit safe
    await sleep(1000);
  }

  console.log(`\n  📊 ${folderName} summary:`);
  console.log(`     ✅ ${ok} uploaded`);
  Object.entries(sourceCount).forEach(([src, count]) => {
    console.log(`        • ${count} from ${src}`);
  });
  console.log(`     ⚠️  ${skip} skipped  ❌ ${fail} failed`);
};

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
const run = async () => {
  console.log("─".repeat(60));
  console.log("  YatriGuide Image Seeder v8");
  console.log("  Serper → Wikipedia → Commons → Apify Google Maps");
  console.log("─".repeat(60));

  if (!SERPER_KEY) {
    console.error("❌  SERPER_API_KEY missing from .env — aborting");
    process.exit(1);
  }
  if (!APIFY_TOKEN) {
    console.error("❌  APIFY_API_TOKEN missing from .env — aborting");
    process.exit(1);
  }

  console.log(`Serper     : ✅`);
  console.log(`Wikipedia  : ✅ free`);
  console.log(`Commons    : ✅ free`);
  console.log(`Apify      : ✅`);
  console.log(`Cloudinary : ${process.env.CLOUDINARY_CLOUD_NAME ? "✅" : "❌"}`);

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅  MongoDB connected\n");

  // ── Test with events first (you shared that file) ─────────────────────────
  //await processModel(Event, "events");

  // ── Uncomment as you go ───────────────────────────────────────────────────
   //await processModel(Shopping,    "shopping");
   await processModel(Hotel,       "hotels");
   await processModel(Restaurant,  "restaurants");
   await processModel(Transport,   "transport");

  console.log("\n🎉  All done!");
  await mongoose.disconnect();
};

run().catch((err) => { console.error(err); process.exit(1); });