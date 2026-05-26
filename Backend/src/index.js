import dotenv from "dotenv"
dotenv.config({
    path : "./.env" // generally in home directory
});
import app from "./app.js"
import connectDB from "./db/index.js"

const  port = process.env.PORT || 8000;

connectDB() .then(()=>{
  // we will be only listening to the port
 app.listen(port,()=>{
    console.log(`App listening on port ${port}`)
 });
}).catch((err)=>{
    console.error("MongoDB connection error",err);
    process.exit(1);
})
