/**
 * Mongoose object for pushSubscriptionObject to send push notifications for browsers
 */

const mongoose = require("mongoose");

const pushSubscriptionObject = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pushSubscriptionObject: {
    endpoint: {
      type: String,
      required: true,
    },
    keys: {
      auth: {
        type: String,
        required: true,
      },
      p256dh: {
        type: String,
        required: true,
      },
    },
  },
});

const PushSubscriptionObject = mongoose.model(
  "PushSubscriptionObject",
  pushSubscriptionObject
);

exports.PushSubscriptionObject = PushSubscriptionObject;
