const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

const getMyConversation = async (req, res) => {
  try {
    let conversation = await Conversation.findOne({
      participants: { $in: [req.user.id] },
    });

    if (!conversation) {
      const admin = await User.findOne({ role: 'admin' });
      if (!admin) return res.status(404).json({ message: 'No admin available to start a chat.' });

      conversation = new Conversation({
        participants: [req.user.id, admin._id],
      });
      await conversation.save();
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching conversation.' });
  }
};

const getAllConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({})
      .populate('participants', 'name studentNumber')
      .populate({ path: 'lastMessage', select: 'text createdAt' })
      .sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching conversations.' });
  }
};

const getMessagesForConversation = async (req, res) => {
  try {
    const messages = await Message.find({ conversation: req.params.id })
      .populate('sender', 'name role')
      .sort({ createdAt: 'asc' });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching messages.' });
  }
};

module.exports = { getMyConversation, getAllConversations, getMessagesForConversation };