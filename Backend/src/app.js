import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from './utils/api-error.js';

import healthCheckRouter from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js";
import cityRouter from "./routes/city.routes.js"; 
import placeRouter from './routes/place.routes.js';
import restaurantRouter from './routes/restaurant.routes.js';
import hotelRouter from "./routes/hotel.routes.js";
import transportRouter from "./routes/transport.routes.js";
import agencyRouter from "./routes/agency.routes.js";
import eventRouter from "./routes/event.routes.js";
import bookmarkRoutes from './routes/bookmark.routes.js';
import savedTripRoutes from './routes/savedTrip.routes.js';
import noteRoutes      from './routes/note.routes.js';
import shoppingRouter from './routes/shopping.routes.js'
const app = express();

// ✅ CORS first
app.use(cors({
    origin : process.env.FRONTEND_URL || "http://localhost:3000",
    credentials : true,
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"]
}))

app.use(express.json({limit : "16kb"}));
app.use(express.urlencoded({extended: true,limit :"16kb"}))
app.use(express.static("public"))
app.use(cookieParser()); 

app.use("/api/v1/healthcheck",healthCheckRouter);
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/cities",cityRouter);
app.use('/api/v1/places', placeRouter);
app.use('/api/v1/restaurants',restaurantRouter);
app.use('/api/v1/hotels',hotelRouter);
app.use("/api/v1/transports",transportRouter);
app.use("/api/v1/agencies",agencyRouter);
app.use("/api/v1/events",eventRouter);
app.use('/api/v1/bookmarks', bookmarkRoutes)
app.use('/api/v1/trips', savedTripRoutes);
app.use('/api/v1/notes', noteRoutes);
app.use("/api/v1/shopping",shoppingRouter);

app.use((err, req, res, next) => {
  console.error('UNEXPECTED ERROR >>>>', err) // ✅ ADD THIS
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      data: null,
      message: err.message,
      success: false,
      errors: err.errors
    })
  }
  res.status(500).json({
    statusCode: 500,
    data: null,
    message: 'Internal Server Error',
    success: false,
    errors: []
  })
})

export default app;