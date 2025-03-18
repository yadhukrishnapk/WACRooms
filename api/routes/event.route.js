// backend/routes/event.route.js
import express from 'express';
import { createEvent, getEvents } from '../controllers/event.controller.js';

const router = express.Router();

router.post('/create', createEvent);
router.get('/room/:room', getEvents);

export default router;