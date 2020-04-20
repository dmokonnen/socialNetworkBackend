/**
 * Model to hold new notifications for user
 */

const mongoose = require("mongoose");

const notification = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  notification: [
    {
      notificationType: {
        type: String,
        required: true,
      },
      data: {},
    },
  ],
});

const Notification = mongoose.model("Notification", notification);

exports.Notification = Notification;
