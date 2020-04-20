const Joi = require('joi');
const mongoose = require('mongoose');
<<<<<<< HEAD
=======

// const commentSchema = new mongoose.Schema({
//   commentTime: {
//     type: Date,
//     default: Date.now,
//   },
//   commentedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true, //commented for  test
//   },
//   content: {
//     type: String,
//     required: true,
//     minlength: 1,
//     maxlength: 50, // users are allowed only 500 word of length
//     trim: true,
//   }
// });

>>>>>>> 6290b6e0de70af3b82c7c16f9cedb4c0a72dca97
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
<<<<<<< HEAD
  comments: [
    {
      comment: {
        type: String,
        minlength: 1,
        maxlength: 500, // users are allowed only 500 word of length
        trim: true,
      },
=======

  comments: [
    {
      type: String,
      maxlength: 50, // max comment length is 50
>>>>>>> 6290b6e0de70af3b82c7c16f9cedb4c0a72dca97
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