import mongoose,{Schema}  from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'Name is required'],
      trim: true,
    },
    fullName :{
        type : String,
        required : true,
        trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 8,
      required: function() {
       return this.authProvider === 'local'  // only required for local users
      },
      select: false, // never returned in queries by default
    },
    avatar: {
        type :{
            url :String,
            localPath : String
        },
        default :{
            url: `https://placehold.co/200x200`,
            localPath : ""
        }
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    googleId: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken:{
        type : String
    },
    forgotPasswordToken: {
        type: String
    },
    forgotPasswordExpiry: {
        type: Date
    },
  },
  { timestamps: true }
)

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return
  this.password = await bcrypt.hash(this.password, 10)
})

// Compare password method
userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email : this.email,
            username : this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
       process.env.REFRESH_TOKEN_SECRET,
       {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
}

userSchema.methods.generateTemporaryToken = function(){
    const unHashedToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto
                 .createHash("sha256") // algorithm
                 .update(unHashedToken)
                 .digest("hex")
    const tokenExpiry = Date.now() + (20*60*1000) //20 min
     return {unHashedToken,hashedToken,tokenExpiry}             
};

export const User =mongoose.model("User",userSchema);