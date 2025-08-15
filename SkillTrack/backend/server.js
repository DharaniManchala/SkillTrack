const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const User = require('./models/User');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Signup route
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const user = new User({ name, email, phone, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login route
// app.post('/api/login', async (req, res) => {
//   try {
//     const { email, phone, password } = req.body;
//     // Find user by email and phone
//     const user = await User.findOne({ email, phone });
//     if (!user) return res.status(400).json({ error: 'Invalid credentials' });

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

//     // Send profileCompleted status
//     res.json({ message: 'Login successful', profileCompleted: user.profileCompleted });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });
// backend/server.js
app.post('/api/login', async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    const user = await User.findOne({ email, phone });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    res.json({
      message: 'Login successful',
      profileCompleted: user.profileCompleted,
      goalsCompleted: user.goalsCompleted
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Profile update route with photo upload
app.post('/api/profile', upload.single('profilePic'), async (req, res) => {
  try {
    const { email, username, about, college } = req.body;
    let updateData = {
      name: username,
      about,
      college,
      profileCompleted: true
    };
    if (req.file) {
      updateData.profilePic = `/uploads/${req.file.filename}`;
    }
    const user = await User.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'Profile updated successfully!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Add to server.js
app.get('/api/profile', async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: 'Email required' });
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({
    name: user.name,
    profilePic: user.profilePic
  });
});
// Add to server.js
app.get('/api/goals', async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: 'Email required' });
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ goals: user.goals || [] });
});

// Serve static files from the SkillTrack folder (one level up from backend)
app.use(express.static(path.join(__dirname, '..')));

// For any route not handled by API, send the corresponding HTML file
app.get('/:page', (req, res) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, '..', page);
  res.sendFile(filePath, err => {
    if (err) res.status(404).send('File not found');
  });
});

// ...existing code...
app.post('/api/goals', async (req, res) => {
  try {
    const { email, goals } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { goals, goalsCompleted: true } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'Goals saved!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// ...existing code...
const uploadDaily = multer({ storage: storage });

app.post('/api/dailyupload', uploadDaily.single('file'), async (req, res) => {
  try {
    const { email, goalTitle, topic, date, title, description, tags } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Find user and push the daily upload under the correct goal/topic
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Find the goal
    const goalIndex = user.goals.findIndex(g => g.title === goalTitle);
    if (goalIndex === -1) return res.status(404).json({ error: 'Goal not found' });

    // Prepare daily upload object
    const dailyUpload = {
      topic,
      date,
      title,
      description,
      tags: tags ? JSON.parse(tags) : [],
      file: filePath,
      percentage: req.body.percentage
    };

    // Push under the goal (you can also push under a topic array if you want)
    if (!user.goals[goalIndex].dailyUploads) user.goals[goalIndex].dailyUploads = [];
    user.goals[goalIndex].dailyUploads.push(dailyUpload);

    await user.save();
    res.json({ message: 'Daily upload saved!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// app.get('/api/progress', async (req, res) => {
//   const { email } = req.query;
//   const user = await User.findOne({ email });
//   if (!user) return res.status(404).json({ error: 'User not found' });

//   const progressData = [];
//   user.goals.forEach(goal => {
//     // Group uploads by topic
//     const topicMap = {};
//     (goal.dailyUploads || []).forEach(upload => {
//       if (!topicMap[upload.topic]) topicMap[upload.topic] = [];
//       topicMap[upload.topic].push(upload);
//     });

//     // Calculate subtopic progress
//     const subtopics = [];
//     Object.keys(topicMap).forEach(topic => {
//       let total = 0;
//       topicMap[topic].forEach(u => {
//         total += Number(u.percentage || 0);
//       });
//       if (total > 100) total = 100;
//       subtopics.push({ topic, progress: total });
//     });

//     // Calculate main goal progress (average of subtopics)
//     const goalProgress = subtopics.length
//       ? Math.round(subtopics.reduce((sum, s) => sum + s.progress, 0) / subtopics.length)
//       : 0;

//     progressData.push({
//       goal: goal.title,
//       progress: goalProgress,
//       subtopics
//     });
//   });

//   res.json({ progress: progressData });
// });
app.get('/api/progress', async (req, res) => {
  const { email, until } = req.query;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const progressData = [];
  user.goals.forEach(goal => {
    // Group uploads by topic
    const topicMap = {};
    (goal.dailyUploads || []).forEach(upload => {
      // Filter by date if 'until' is provided
      if (until && upload.date > until) return;
      if (!topicMap[upload.topic]) topicMap[upload.topic] = [];
      topicMap[upload.topic].push(upload);
    });

    // Calculate subtopic progress
    const subtopics = [];
    Object.keys(topicMap).forEach(topic => {
      let total = 0;
      topicMap[topic].forEach(u => {
        total += Number(u.percentage || 0);
      });
      if (total > 100) total = 100;
      subtopics.push({ topic, progress: total });
    });

    // Calculate main goal progress (average of subtopics)
    const goalProgress = subtopics.length
      ? Math.round(subtopics.reduce((sum, s) => sum + s.progress, 0) / subtopics.length)
      : 0;

    progressData.push({
      goal: goal.title,
      progress: goalProgress,
      subtopics
    });
  });

  res.json({ progress: progressData });
});
// ...existing code...
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

