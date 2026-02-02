import express from 'express';
import {
  addTimesheetEntry,
  getTimesheetsByClassSession,
  updateTimesheetEntry
} from '../controllers/timesheet.controller.js';

const router = express.Router();

// ➕ Add a new timesheet to a class session inside a classroom
router.post('/timesheet/:class_id/add/:classSessionId', addTimesheetEntry);

// 📥 Get all timesheets linked to a specific class session
router.get('/timesheet/class-session/:classSessionId', getTimesheetsByClassSession);

// ✏️ Update a specific timesheet
router.put('/timesheet/:timesheetId', updateTimesheetEntry);

export default router;
