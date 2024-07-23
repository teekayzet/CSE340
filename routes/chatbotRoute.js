// routes/chatbotRoute.js
const express = require('express');
const router = express.Router();
const path = require('path');
const { handleMessage } = require("../controllers/messageController");

// Render the chatbot page
router.get('/', (req, res) => {
  res.render('chatbot/chatbot', { title: 'Chatbot' });
  title: 'Chatbot' // Pass title to layout
});

router.post("/message", handleMessage);

module.exports = router;
