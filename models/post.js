const Joi = require('joi');
const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
  postTime: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, //commented for  test
  },
  content: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 500, // users are allowed only 500 word of length
    trim: true,
  },
  hasUnhealthy: {
    type: Boolean,
    default: false,
  },
  notifyFollowers: {
    type: Boolean,
    default: false,
  },
  comments: [
    {
      comment: {
        type: String,
        minlength: 1,
        maxlength: 500, // users are allowed only 500 word of length
        trim: true,
      },
      commentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      commentTime: {
        type: Date,
        default: Date.now,
      }
    }
  ],
  // comments: [commentSchema],
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  unlikedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  imagePath: {
    type: String,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
});

const Post = mongoose.model('Post', postSchema);
exports.Post = Post;