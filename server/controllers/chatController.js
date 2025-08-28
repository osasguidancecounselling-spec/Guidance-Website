const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

const getMyConversation = async (req, res) => {
  try {
    const studentId = req.user.id;

    // 1. Check if the student already has a conversation.
    // This ensures they always reconnect to the same staff member.
    let conversation = await Conversation.findOne({ participants: studentId });

    if (conversation) {
      // If a conversation exists, populate it and return it.
      await conversation.populate('participants', 'name role');
      return res.json(conversation);
    }

    // 2. If no conversation exists, find the best staff member to assign.
    // We'll use a "least-loaded" strategy.
    const staffMembers = await User.find({ role: { $in: ['admin', 'counselor'] } }).select('_id').lean();

    if (staffMembers.length === 0) {
      return res.status(404).json({ message: 'No staff available to start a chat.' });
    }

    // Use aggregation to find the number of conversations for each staff member.
    const conversationCounts = await Conversation.aggregate([
      { $unwind: '$participants' },
      { $group: { _id: '$participants', count: { $sum: 1 } } },
    ]);

    // Create a map of staffId -> count.
    const staffCounts = new Map(conversationCounts.map(item => [item._id.toString(), item.count]));

    // Find the staff member with the minimum number of conversations.
    let leastLoadedStaff = staffMembers[0];
    let minConversations = Infinity;

    for (const staff of staffMembers) {
      const count = staffCounts.get(staff._id.toString()) || 0;
      if (count < minConversations) {
        minConversations = count;
        leastLoadedStaff = staff;
      }
    }

    // 3. Create a new conversation with the selected staff member.
    console.log(`Creating new conversation for student ${studentId} with staff ${leastLoadedStaff._id}`);
    conversation = new Conversation({
      participants: [studentId, leastLoadedStaff._id],
    });
    await conversation.save();
    
    // Populate the new conversation before sending it back.
    await conversation.populate('participants', 'name role');

    res.status(201).json(conversation);

  } catch (error) {
    console.error("Error in getMyConversation:", error);
    res.status(500).json({ message: 'Server error while fetching conversation.' });
  }
};

const getAllConversations = async (req, res) => {
  try {
    const query = {};
    // If the user is a counselor (but not an admin), only show their conversations.
    if (req.user.role === 'counselor') {
      query.participants = req.user.id;
    }
    // Admins will see all conversations because the query object is empty.

    const conversations = await Conversation.find(query)
      .populate('participants', 'name studentNumber role')
      .populate({ path: 'lastMessage', select: 'text createdAt sender' })
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