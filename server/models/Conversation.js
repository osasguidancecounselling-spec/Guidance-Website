const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema(
  {
    // Array of participants (student and admin)
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Reference to the last message for quick preview
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', ConversationSchema);