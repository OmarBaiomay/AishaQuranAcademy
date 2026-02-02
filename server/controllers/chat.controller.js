import ChatMessage from '../models/chatMessage.model.js';
import User from '../models/user.model.js';
import models from '../models/classroom.model.js';
const { Classroom } = models;

// GET /api/chat/:classroomId/messages?page=page&limit=limit
export const getClassroomMessages = async (req, res) => {
  const { classroomId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 200;
  const skip = (page - 1) * limit;

  try {
    console.log(`[Chat API] Fetching messages for classroom: ${classroomId} (User: ${req.user?.fullName})`);
    
    // Verify user has access to this classroom
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Check if user has access to this classroom
    const hasAccess = req.user.role === 'Administrator' ||
      classroom.student.toString() === req.user._id.toString() ||
      classroom.teacher.toString() === req.user._id.toString() ||
      classroom.supervisor.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied to this classroom' });
    }

    const messages = await ChatMessage.find({ classroomId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate('senderId', 'fullName profilePic role');

    const total = await ChatMessage.countDocuments({ classroomId });
    
    console.log(`[Chat API] Found ${messages.length} messages for classroom ${classroomId}`);

    res.json({
      messages: messages.map(msg => ({
        _id: msg._id,
        classroomId: msg.classroomId,
        senderId: msg.senderId._id,
        senderRole: msg.senderRole,
        message: msg.message,
        type: msg.type,
        fileUrl: msg.fileUrl,
        createdAt: msg.createdAt,
        deliveredTo: msg.deliveredTo,
        readBy: msg.readBy,
        sender: {
          fullName: msg.senderId.fullName,
          profilePic: msg.senderId.profilePic,
          role: msg.senderId.role,
        },
      })),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(`[Chat API] Error fetching messages:`, err);
    res.status(500).json({ message: 'Failed to fetch messages', error: err.message });
  }
};

// GET /api/chat/:classroomId/unread-count
export const getUnreadCount = async (req, res) => {
  const { classroomId } = req.params;
  
  // Check if req.user exists
  if (!req.user || !req.user._id) {
    console.error('[Chat API] getUnreadCount - req.user is undefined');
    return res.status(401).json({ message: 'User not authenticated' });
  }
  
  const userId = req.user._id;

  try {
    console.log(`[Chat API] Getting unread count for classroom ${classroomId}, user ${req.user.fullName}`);
    
    // Verify user has access to this classroom
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    const hasAccess = req.user.role === 'Administrator' ||
      classroom.student.toString() === userId.toString() ||
      classroom.teacher.toString() === userId.toString() ||
      classroom.supervisor.toString() === userId.toString();

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied to this classroom' });
    }

    const unreadCount = await ChatMessage.countDocuments({
      classroomId,
      senderId: { $ne: userId },
      readBy: { $nin: [userId] }
    });

    console.log(`[Chat API] Unread count for ${req.user.fullName}: ${unreadCount}`);
    res.json({ count: unreadCount });
  } catch (error) {
    console.error('[Chat API] Error getting unread count:', error);
    res.status(500).json({ message: 'Failed to get unread count' });
  }
};

// GET /api/chat/:classroomId/last-message
export const getLastMessage = async (req, res) => {
  const { classroomId } = req.params;

  try {
    console.log(`[Chat API] Getting last message for classroom ${classroomId}`);
    
    // Verify user has access to this classroom
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Check if req.user exists
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const hasAccess = req.user.role === 'Administrator' ||
      classroom.student.toString() === req.user._id.toString() ||
      classroom.teacher.toString() === req.user._id.toString() ||
      classroom.supervisor.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied to this classroom' });
    }

    const lastMessage = await ChatMessage.findOne({ classroomId })
      .sort({ createdAt: -1 })
      .populate('senderId', 'fullName profilePic role')
      .limit(1);

    res.json({ 
      message: lastMessage ? {
        _id: lastMessage._id,
        message: lastMessage.message,
        type: lastMessage.type,
        fileUrl: lastMessage.fileUrl,
        createdAt: lastMessage.createdAt,
        sender: lastMessage.senderId
      } : null 
    });
  } catch (error) {
    console.error('[Chat API] Error getting last message:', error);
    res.status(500).json({ message: 'Failed to get last message' });
  }
};

// PUT /api/chat/:classroomId/mark-read
export const markClassroomAsRead = async (req, res) => {
  const { classroomId } = req.params;
  
  // Check if req.user exists
  if (!req.user || !req.user._id) {
    console.error('[Chat API] markClassroomAsRead - req.user is undefined');
    return res.status(401).json({ message: 'User not authenticated' });
  }
  
  const userId = req.user._id;

  try {
    console.log(`[Chat API] Marking classroom ${classroomId} as read for user ${req.user.fullName}`);
    
    // Verify user has access to this classroom
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    const hasAccess = req.user.role === 'Administrator' ||
      classroom.student.toString() === userId.toString() ||
      classroom.teacher.toString() === userId.toString() ||
      classroom.supervisor.toString() === userId.toString();

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied to this classroom' });
    }

    const result = await ChatMessage.updateMany(
      { 
        classroomId,
        senderId: { $ne: userId },
        readBy: { $nin: [userId] }
      },
      { 
        $addToSet: { readBy: userId }
      }
    );

    console.log(`[Chat API] Marked ${result.modifiedCount} messages as read for ${req.user.fullName}`);
    res.json({ message: 'Messages marked as read', modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error('[Chat API] Error marking messages as read:', error);
    res.status(500).json({ message: 'Failed to mark messages as read' });
  }
};

// GET /api/chat/classrooms - Get all classrooms for current user
export const getUserClassrooms = async (req, res) => {
  try {
    console.log(`[Chat API] Getting classrooms for user ${req.user.fullName} (${req.user.role})`);
    
    let query = {};
    
    // Filter based on user role
    if (req.user.role === 'Administrator') {
      // Admins can see all classrooms
      query = {};
    } else if (req.user.role === 'Student') {
      query = { student: req.user._id };
    } else if (req.user.role === 'Teacher') {
      query = { teacher: req.user._id };
    } else if (req.user.role === 'Supervisor') {
      query = { supervisor: req.user._id };
    }

    const classrooms = await Classroom.find(query)
      .populate('student', 'fullName profilePic')
      .populate('teacher', 'fullName profilePic')
      .populate('supervisor', 'fullName profilePic')
      .sort({ updatedAt: -1 });

    console.log(`[Chat API] Found ${classrooms.length} classrooms for ${req.user.fullName}`);
    res.json(classrooms);
  } catch (error) {
    console.error('[Chat API] Error getting user classrooms:', error);
    res.status(500).json({ message: 'Failed to get classrooms' });
  }
};

// GET /api/chat/stats - Get chat statistics for current user
export const getChatStats = async (req, res) => {
  try {
    console.log(`[Chat API] Getting chat stats for user ${req.user.fullName}`);
    
    let classroomQuery = {};
    
    // Filter based on user role
    if (req.user.role === 'Administrator') {
      classroomQuery = {};
    } else if (req.user.role === 'Student') {
      classroomQuery = { student: req.user._id };
    } else if (req.user.role === 'Teacher') {
      classroomQuery = { teacher: req.user._id };
    } else if (req.user.role === 'Supervisor') {
      classroomQuery = { supervisor: req.user._id };
    }

    const classrooms = await Classroom.find(classroomQuery, '_id');
    const classroomIds = classrooms.map(c => c._id);

    // Get total unread count across all classrooms
    const totalUnread = await ChatMessage.countDocuments({
      classroomId: { $in: classroomIds },
      senderId: { $ne: req.user._id },
      readBy: { $nin: [req.user._id] }
    });

    // Get total message count
    const totalMessages = await ChatMessage.countDocuments({
      classroomId: { $in: classroomIds }
    });

    // Get messages sent by user
    const messagesSent = await ChatMessage.countDocuments({
      classroomId: { $in: classroomIds },
      senderId: req.user._id
    });

    res.json({
      totalClassrooms: classrooms.length,
      totalUnread,
      totalMessages,
      messagesSent,
      messagesReceived: totalMessages - messagesSent
    });
  } catch (error) {
    console.error('[Chat API] Error getting chat stats:', error);
    res.status(500).json({ message: 'Failed to get chat stats' });
  }
};