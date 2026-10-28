const express = require('express');
const router = express.Router();
const {
  getRooms,
  getRoomById,
  checkSingleRoomAvailability,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getRooms);
router.get('/:id', getRoomById);
router.get('/:id/availability', checkSingleRoomAvailability);

// Admin-protected routes
router.post('/', protect, authorize('admin'), createRoom);
router.put('/:id', protect, authorize('admin'), updateRoom);
router.delete('/:id', protect, authorize('admin'), deleteRoom);

module.exports = router;
