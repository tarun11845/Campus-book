import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email) {
          return email.endsWith("@nitk.edu.in");
        },
        message: "Only NITK college emails are allowed",
      },
    },

    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },

    isEmailVerified: { type: Boolean, default: false },
    isAdminVerified: { type: Boolean, default: false },

    otp: String,
    otpExpiry: Date,
    resetPasswordToken: String,
  },
  { timestamps: true }
);

UserSchema.methods.setPassword = async function (password) {
  this.passwordHash = await bcrypt.hash(password, 10);
};

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

UserSchema.methods.generateOTP = function () {
  this.otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  return this.otp;
};

UserSchema.methods.verifyOTP = function (input) {
  if (!this.otp || !this.otpExpiry) return false;
  if (Date.now() > this.otpExpiry.getTime()) return false;
  return this.otp === input;
};

export default mongoose.model("User", UserSchema);
