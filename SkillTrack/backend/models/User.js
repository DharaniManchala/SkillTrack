// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String, required: true },
//   password: { type: String, required: true },
//   profileCompleted: { type: Boolean, default: false },
//   about: { type: String },      // <-- add this
//   college: { type: String } ,
//   profilePic: {type :String}  ,
//   // backend/models/User.js
// goalsCompleted: { type: Boolean, default: false } ,
// goals: { type: Array, default: [] },
// goals: [{
//   title: String,
//   tags: [String],
//   dailyUploads: [{
//     topic: String,
//     date: String, // e.g., "2025-03-14"
//     title: String,
//     description: String,
//     tags: [String],
//     file: String,
//     percentage: Number
//   }]
// }]
// // goals: [{
// //   title: String,
// //   tags: [String],
// //   dailyUploads: [{
// //     topic: String,
// //     date: String,
// //     title: String,
// //     description: String,
// //     tags: [String],
// //     file: String,
// //     percentage: Number
// //   }]
// // }]// <-- add this
// });

// module.exports = mongoose.model('User', userSchema);

















// // const mongoose = require('mongoose');

// // const userSchema = new mongoose.Schema({
// //   name: { type: String, required: true },
// //   email: { type: String, required: true, unique: true },
// //   phone: { type: String, required: true },
// //   password: { type: String, required: true }
// // });

// // module.exports = mongoose.model('User', userSchema);



const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  profileCompleted: { type: Boolean, default: false },
  about: { type: String },
  college: { type: String },
  profilePic: { type: String },
  goalsCompleted: { type: Boolean, default: false },
  goals: [{
    title: String,
    tags: [String],
    topics: [String], // <-- ADD THIS LINE!
    dailyUploads: [{
      topic: String,
      date: String, // e.g., "2025-03-14"
      title: String,
      description: String,
      tags: [String],
      file: String,
      percentage: Number
    }]
  }]
});

module.exports = mongoose.model('User', userSchema);