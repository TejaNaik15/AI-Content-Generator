const mongoose = require("mongoose");

//Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    trialPeriod: {
      type: Number,
      default: 3, //3 days
    },
    trialActive: {
      type: Boolean,
      default: true,
    },
    trialExpires: {
      type: Date,
    },
    subscriptionPlan: {
      type: String,
      enum: ["Trial", "Free", "Basic", "Premium"],
      default: "Trial",
    },
    apiRequestCount: {
      type: Number,
      default: 0,
    },
    monthlyRequestCount: {
      type: Number,
      default: function() {
        if (this.subscriptionPlan === "Free") return 5;
        if (this.subscriptionPlan === "Trial") return 1000;
        if (this.subscriptionPlan === "Basic") return 50;
        if (this.subscriptionPlan === "Premium") return 100;
        return 5; // Default to Free plan limit
      }
    },
    nextBillingDate: Date,
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
    contentHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ContentHistory",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//! Compile to form the model
const User = mongoose.model("User", userSchema);

module.exports = User;