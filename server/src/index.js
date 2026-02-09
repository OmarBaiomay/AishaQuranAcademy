import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import { connectDB } from "../lib/db.js";

import authRoutes from "../routes/auth.routes.js";
import classroomRoutes from "../routes/classroom.routes.js";
import userRoutes from "../routes/user.routes.js";
import testimonialRoutes from "../routes/testimonial.routes.js";
import courseRoutes from "../routes/course.routes.js";
import blogRoutes from "../routes/blog.routes.js";
import categoryRoutes from "../routes/blogCategory.routes.js";
import uploadRoutes from "../routes/upload.routes.js";
import notificationRoutes from "../routes/notification.routes.js";
import reportsRoutes from "../routes/report.routes.js";
import studentPaymentRoutes from "../routes/studentPayment.routes.js";
import locationRoutes from "../routes/location.route.js";
import adminRoutes from "../routes/admin.routes.js";
import invoiceRoutes from "../routes/invoice.routes.js";
import payrollRoutes from "../routes/payroll.routes.js";
import timesheet from "../routes/timesheet.routes.js";
import chatRoutes from "../routes/chat.routes.js";

import ChatMessage from "../models/chatMessage.model.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import models from "../models/classroom.model.js";
import { sendNotification } from "../services/NotificationService.js";
import Notification from "../models/notification.model.js";

import registrationRoutes from "../routes/registration.routes.js";


const { Classroom } = models;

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

/**
 * ✅ One source of truth for allowed origins (Express + Socket.io)
 * Add both www and non-www, plus any FE deploy domains you use.
 */
const allowedOrigins = new Set([
  "http://localhost:5173",
  "https://aishaquranacademyfe.onrender.com",
  "https://aishaquran.com",
  "https://www.aishaquran.com",
  "https://www.app.aishaquran.com",
  "https://eb63ce160648.ngrok-free.app",
]);

/**
 * ✅ CORS options shared by Express (and we’ll use a compatible approach for Socket.io)
 * Using a function allows:
 * - Requests with no Origin (curl/postman) -> allowed
 * - Exact whitelist match -> allowed
 * - Everything else -> blocked (clear error)
 */
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

// ==================== EXPRESS MIDDLEWARE ====================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// ✅ CORS must be BEFORE routes
app.use(cors(corsOptions));
// ✅ Handle preflight for ALL routes
app.options("*", cors(corsOptions));

// Create HTTP server and attach Socket.io
const httpServer = createServer(app);

/**
 * ✅ Socket.io CORS: socket.io does not use the same exact corsOptions signature,
 * so we pass a similar dynamic function.
 */
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error(`Socket.IO CORS blocked: ${origin}`), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

// ==================== GLOBAL STATE MANAGEMENT ====================
const onlineUsers = new Map(); // userId -> { socketId, userData }
const userSockets = new Map(); // userId -> Set of socketIds
const typingUsers = new Map(); // classroomId -> Map(userId -> { userName, timestamp })

const addOnlineUser = (userId, socketId, userData) => {
  onlineUsers.set(userId, { socketId, userData });

  if (!userSockets.has(userId)) userSockets.set(userId, new Set());
  userSockets.get(userId).add(socketId);

  console.log(
    `[Online Users] ✅ ${userData.fullName} is now online (${onlineUsers.size} total)`
  );
};

const removeOnlineUser = (userId, socketId) => {
  const userData = onlineUsers.get(userId);

  if (userSockets.has(userId)) {
    userSockets.get(userId).delete(socketId);
    if (userSockets.get(userId).size === 0) {
      userSockets.delete(userId);
      onlineUsers.delete(userId);
      console.log(
        `[Online Users] ❌ ${
          userData?.userData?.fullName || userId
        } is now offline (${onlineUsers.size} total)`
      );
      return true;
    }
  }
  return false;
};

const getOnlineUserIds = () => Array.from(onlineUsers.keys());

const broadcastOnlineUsers = () => {
  const onlineUserIds = getOnlineUserIds();
  io.emit("onlineUsers", onlineUserIds);
  console.log(
    `[Online Users] 📡 Broadcasted online users list: ${onlineUserIds.length} users`
  );
};

const cleanupOldTyping = () => {
  const now = Date.now();
  const timeout = 5000;

  for (const [classroomId, users] of typingUsers.entries()) {
    for (const [userId, data] of users.entries()) {
      if (now - data.timestamp > timeout) {
        users.delete(userId);
        console.log(
          `[Typing] 🧹 Cleaned up old typing indicator for user ${userId} in room ${classroomId}`
        );
      }
    }
    if (users.size === 0) typingUsers.delete(classroomId);
  }
};

setInterval(cleanupOldTyping, 10000);

const getUnreadCount = async (userId, classroomId) => {
  try {
    const count = await ChatMessage.countDocuments({
      classroomId,
      senderId: { $ne: userId },
      readBy: { $nin: [userId] },
    });
    return count;
  } catch (error) {
    console.error("[Unread Count] Error:", error);
    return 0;
  }
};

const updateUnreadCounts = async (userId) => {
  try {
    const classrooms = await Classroom.find({
      $or: [{ student: userId }, { teacher: userId }, { supervisor: userId }],
    });

    const counts = {};
    for (const classroom of classrooms) {
      const count = await getUnreadCount(userId, classroom._id);
      if (count > 0) counts[classroom._id.toString()] = count;
    }

    io.to(userId.toString()).emit("unreadCounts", counts);
    console.log(`[Unread Counts] 📊 Sent unread counts to ${userId}:`, counts);
  } catch (error) {
    console.error("[Unread Counts] Error updating:", error);
  }
};

// ==================== SOCKET.IO CONNECTION HANDLER ====================
io.on("connection", async (socket) => {
  console.log("[Socket.IO] 🔌 New connection:", socket.id);

  socket.onAny((event, ...args) => {
    if (event === "sendMessage") {
      console.log("[Socket.IO] 📨 Event received: sendMessage");
    } else if (!["ping", "pong"].includes(event)) {
      console.log(`[Socket.IO] 📡 Event received: ${event}`);
    }
  });

  // ==================== AUTHENTICATION ====================
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  let user = null;

  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded.userId);
    }
  } catch (err) {
    console.log(
      `[Socket.IO] ❌ Authentication failed for socket ${socket.id}:`,
      err.message
    );
    socket.emit("error", "Authentication failed");
    socket.disconnect();
    return;
  }

  if (!user) {
    console.log(`[Socket.IO] ❌ No user found for socket ${socket.id}`);
    socket.emit("error", "Authentication required");
    socket.disconnect();
    return;
  }

  socket.data.user = user;
  console.log(
    `[Socket.IO] ✅ User connected: ${user.fullName} (${user.role}) [${socket.id}]`
  );

  const wasOffline = !onlineUsers.has(user._id.toString());
  addOnlineUser(user._id.toString(), socket.id, user);

  socket.join(user._id.toString());
  console.log(`[Socket.IO] 🏠 Auto-joined personal room: ${user._id}`);

  if (wasOffline) {
    socket.broadcast.emit("userOnline", user._id.toString());
    console.log(`[Socket.IO] 📡 Broadcasted user online: ${user.fullName}`);
  }

  socket.emit("onlineUsers", getOnlineUserIds());
  await updateUnreadCounts(user._id);

  socket.on("joinUserRoom", (userId) => {
    console.log(
      `[Server] 👤 ${user.fullName} requesting to join user room: ${userId}`
    );

    if (user._id.toString() !== userId) {
      console.log(
        `[Server] ❌ Unauthorized room access attempt by ${user.fullName} for room ${userId}`
      );
      socket.emit("error", "Unauthorized room access");
      return;
    }

    socket.join(userId);
    console.log(`[Server] ✅ ${user.fullName} joined personal room: ${userId}`);

    socket.emit("joinedUserRoom", {
      userId,
      success: true,
      message: `Joined personal room successfully`,
    });
  });

  socket.on("joinClassroom", async (classroomId) => {
    if (!classroomId) {
      socket.emit("error", "No classroom ID provided");
      return;
    }

    console.log(
      `[Server] 🏫 ${user.fullName} (${user.role}) joining classroom: ${classroomId}`
    );

    try {
      const classroom = await Classroom.findById(classroomId);
      if (classroom) {
        const hasAccess =
          user.role === "Administrator" ||
          classroom.student._id.toString() === user._id.toString() ||
          classroom.teacher._id.toString() === user._id.toString() ||
          classroom.supervisor._id.toString() === user._id.toString();

        if (!hasAccess) {
          socket.emit("error", "Access denied to this classroom");
          return;
        }
      }
    } catch (err) {
      console.log(`[Server] ⚠️ Could not verify classroom access: ${err.message}`);
    }

    socket.join(classroomId);

    const roomSockets = await io.in(classroomId).fetchSockets();
    socket.emit("joinedClassroom", {
      classroomId,
      success: true,
      rooms: Array.from(socket.rooms),
      roomUserCount: roomSockets.length,
    });

    try {
      await ChatMessage.updateMany(
        {
          classroomId,
          senderId: { $ne: user._id },
          readBy: { $nin: [user._id] },
        },
        { $addToSet: { readBy: user._id } }
      );

      await updateUnreadCounts(user._id);
    } catch (error) {
      console.error("[Server] ❌ Error marking messages as read on join:", error);
    }
  });

  socket.on("typing", ({ classroomId, userId, userName, isTyping }) => {
    if (!classroomId) return;

    if (!typingUsers.has(classroomId)) typingUsers.set(classroomId, new Map());
    const roomTyping = typingUsers.get(classroomId);

    if (isTyping) roomTyping.set(userId, { userName, timestamp: Date.now() });
    else roomTyping.delete(userId);

    socket
      .to(classroomId)
      .emit("typing", { classroomId, userId, userName, isTyping });
  });

  socket.on("sendMessage", async (data) => {
    try {
      const { classroomId, message, type = "text", fileUrl = "" } = data;

      if (!classroomId || (!message && !fileUrl)) {
        socket.emit("error", "Invalid message data");
        return;
      }

      if (!Array.from(socket.rooms).includes(classroomId)) {
        socket.join(classroomId);
      }

      const chatMsg = new ChatMessage({
        classroomId,
        senderId: user._id,
        senderRole: user.role,
        message: message || "",
        type,
        fileUrl,
        deliveredTo: [user._id],
        readBy: [user._id],
      });

      await chatMsg.save();

      const messagePayload = {
        _id: chatMsg._id,
        classroomId,
        senderId: user._id,
        senderRole: user.role,
        message: chatMsg.message,
        type: chatMsg.type,
        fileUrl: chatMsg.fileUrl,
        createdAt: chatMsg.createdAt,
        sender: {
          fullName: user.fullName,
          profilePic: user.profilePic,
          role: user.role,
        },
        deliveredTo: chatMsg.deliveredTo,
        readBy: chatMsg.readBy,
      };

      io.to(classroomId).emit("newMessage", messagePayload);

      // Update unread counts + notifications (kept from your code)
      try {
        const classroom = await Classroom.findById(classroomId).populate([
          "student",
          "teacher",
          "supervisor",
        ]);
        if (!classroom) return;

        const admins = await User.find({ role: "Administrator" });

        const recipients = [classroom.student, classroom.teacher, classroom.supervisor, ...admins].filter(
          (u) => u && u._id.toString() !== user._id.toString()
        );

        for (const recipient of recipients) {
          await updateUnreadCounts(recipient._id);

          const notif = await Notification.create({
            recipient: recipient._id,
            type: "chat",
            title: `New message from ${user.fullName}`,
            body:
              type === "text"
                ? message.length > 60
                  ? message.slice(0, 60) + "..."
                  : message
                : type === "audio"
                ? "Sent a voice message"
                : "Sent a file",
            data: {
              classroomId: classroomId.toString(),
              senderId: user._id.toString(),
              type,
              fileUrl,
            },
          });

          io.to(recipient._id.toString()).emit("newNotification", {
            _id: notif._id,
            title: notif.title,
            body: notif.body,
            type: notif.type,
            data: notif.data,
            createdAt: notif.createdAt,
          });

          if (recipient.fcmTokens && recipient.fcmTokens.length > 0) {
            for (const tokenObj of recipient.fcmTokens) {
              try {
                await sendNotification(
                  tokenObj.token,
                  `New message from ${user.fullName}`,
                  type === "text"
                    ? message.length > 60
                      ? message.slice(0, 60) + "..."
                      : message
                    : type === "audio"
                    ? "Sent a voice message"
                    : "Sent a file",
                  {
                    classroomId: classroomId.toString(),
                    senderId: user._id.toString(),
                    type,
                    fileUrl,
                  }
                );
              } catch (fcmError) {
                console.error(
                  `[Server] ❌ FCM error for ${recipient.fullName}:`,
                  fcmError.message
                );
              }
            }
          }
        }
      } catch (notifError) {
        console.error("[Server] ❌ Error sending notifications:", notifError.message);
      }
    } catch (err) {
      console.error(`[Server] ❌ Error in sendMessage from ${user.fullName}:`, err);
      socket.emit("error", "Failed to save message");
    }
  });

  if (user.role === "Administrator") {
    socket.join("admins");
    try {
      const classrooms = await Classroom.find({}, "_id");
      classrooms.forEach((c) => socket.join(c._id.toString()));
    } catch (err) {
      console.error("[Server] ❌ Error joining admin to all classrooms:", err.message);
    }
  }

  socket.on("disconnect", () => {
    console.log(
      `[Server] 👋 User disconnected: ${user.fullName} (${user.role}) [${socket.id}]`
    );

    const isCompletelyOffline = removeOnlineUser(user._id.toString(), socket.id);

    if (isCompletelyOffline) {
      socket.broadcast.emit("userOffline", user._id.toString());
      broadcastOnlineUsers();
    }

    for (const [classroomId, users] of typingUsers.entries()) {
      if (users.has(user._id.toString())) {
        users.delete(user._id.toString());
        io.to(classroomId).emit("typing", {
          classroomId,
          userId: user._id.toString(),
          userName: user.fullName,
          isTyping: false,
        });
      }
    }
  });

  socket.on("error", (error) => {
    console.error(`[Server] ❌ Socket error for ${user.fullName}:`, error);
  });
});

// ==================== API ROUTES ====================
app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api", locationRoutes);
app.use("/api", classroomRoutes);
app.use("/api", userRoutes);
app.use("/api", testimonialRoutes);
app.use("/api", courseRoutes);
app.use("/api", blogRoutes);
app.use("/api", reportsRoutes);
app.use("/api", timesheet);
app.use("/api", studentPaymentRoutes);
app.use("/api", categoryRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/payrolls", payrollRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", chatRoutes);
app.use("/api", registrationRoutes);

// ==================== HEALTH CHECK ====================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    onlineUsers: onlineUsers.size,
  });
});

// ✅ CORS debug endpoint (remove later if you want)
app.get("/api/cors-test", (req, res) => {
  res.json({ ok: true, origin: req.headers.origin || null });
});

// ==================== SOCKET.IO STATUS ENDPOINT ====================
app.get("/api/socket-status", async (req, res) => {
  try {
    const sockets = await io.fetchSockets();
    const connectedUsers = sockets.map((s) => ({
      id: s.id,
      user: s.data.user
        ? {
            fullName: s.data.user.fullName,
            role: s.data.user.role,
            _id: s.data.user._id,
          }
        : null,
      rooms: Array.from(s.rooms),
    }));

    res.json({
      totalConnected: sockets.length,
      onlineUsers: onlineUsers.size,
      users: connectedUsers,
      onlineUserIds: getOnlineUserIds(),
      typingRooms: Array.from(typingUsers.keys()),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get socket status" });
  }
});

// ==================== GET UNREAD COUNTS API ====================
app.get("/api/chat/unread-counts/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const classrooms = await Classroom.find({
      $or: [{ student: userId }, { teacher: userId }, { supervisor: userId }],
    });

    const counts = {};
    for (const classroom of classrooms) {
      const count = await getUnreadCount(userId, classroom._id);
      if (count > 0) counts[classroom._id.toString()] = count;
    }

    res.json(counts);
  } catch (error) {
    console.error("Error getting unread counts:", error);
    res.status(500).json({ error: "Failed to get unread counts" });
  }
});

// ==================== ERROR HANDLING MIDDLEWARE ====================
app.use((err, req, res, next) => {
  console.error("[Express] ❌ Unhandled error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ==================== START SERVER ====================

await connectDB();

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔌 Socket.io server ready for connections`);
  console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
  console.log(
    `📊 Socket status available at http://localhost:${PORT}/api/socket-status`
  );
  console.log(
    `📈 Unread counts API available at http://localhost:${PORT}/api/chat/unread-counts/:userId`
  );
});

// ==================== GRACEFUL SHUTDOWN ====================
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received, shutting down gracefully");
  httpServer.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("👋 SIGINT received, shutting down gracefully");
  httpServer.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

export default app;
