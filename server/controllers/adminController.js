const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');

// @desc    Get dashboard statistics (counts, revenue, occupancy, recent bookings)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalRooms, totalBookings, totalUsers] = await Promise.all([
      Room.countDocuments(),
      Booking.countDocuments(),
      User.countDocuments(),
    ]);

    // Room status counts
    const availableRooms = await Room.countDocuments({ status: 'Available' });
    const maintenanceRooms = await Room.countDocuments({ status: 'Maintenance' });

    // Revenue calculation for active/completed bookings (excluding cancelled)
    const revenueAgg = await Booking.aggregate([
      {
        $match: {
          bookingStatus: { $in: ['Confirmed', 'Completed'] },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Booking status breakdown
    const confirmedBookings = await Booking.countDocuments({ bookingStatus: 'Confirmed' });
    const pendingBookings = await Booking.countDocuments({ bookingStatus: 'Pending' });
    const cancelledBookings = await Booking.countDocuments({ bookingStatus: 'Cancelled' });
    const completedBookings = await Booking.countDocuments({ bookingStatus: 'Completed' });

    // Recent 6 bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('room', 'roomNumber title type pricePerNight')
      .sort({ createdAt: -1 })
      .limit(6);

    // Current occupancy rate estimate
    const today = new Date();
    const currentlyOccupiedRooms = await Booking.countDocuments({
      bookingStatus: 'Confirmed',
      checkIn: { $lte: today },
      checkOut: { $gte: today },
    });

    const occupancyRate = totalRooms > 0 ? Math.round((currentlyOccupiedRooms / totalRooms) * 100) : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalRooms,
        availableRooms,
        maintenanceRooms,
        totalBookings,
        confirmedBookings,
        pendingBookings,
        cancelledBookings,
        completedBookings,
        totalUsers,
        totalRevenue,
        occupancyRate,
      },
      recentBookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings with filters for admin
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { status, paymentStatus, search } = req.query;

    const query = {};
    if (status && status !== 'All') {
      query.bookingStatus = status;
    }
    if (paymentStatus && paymentStatus !== 'All') {
      query.paymentStatus = paymentStatus;
    }

    let bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('room', 'roomNumber title type pricePerNight')
      .sort({ createdAt: -1 });

    if (search) {
      const searchLower = search.toLowerCase();
      bookings = bookings.filter((b) => {
        const userName = b.user ? b.user.name.toLowerCase() : '';
        const userEmail = b.user ? b.user.email.toLowerCase() : '';
        const roomNum = b.room ? b.room.roomNumber.toLowerCase() : '';
        const roomTitle = b.room ? b.room.title.toLowerCase() : '';
        const id = b._id.toString().toLowerCase();
        return (
          userName.includes(searchLower) ||
          userEmail.includes(searchLower) ||
          roomNum.includes(searchLower) ||
          roomTitle.includes(searchLower) ||
          id.includes(searchLower)
        );
      });
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status and payment status by admin
// @route   PUT /api/admin/bookings/:id
// @access  Private/Admin
const updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingStatus, paymentStatus } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (bookingStatus) {
      const validStatuses = ['Confirmed', 'Pending', 'Cancelled', 'Completed'];
      if (!validStatuses.includes(bookingStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid booking status: ${bookingStatus}`,
        });
      }
      booking.bookingStatus = bookingStatus;
    }

    if (paymentStatus) {
      const validPayments = ['Pending', 'Paid', 'Refunded'];
      if (!validPayments.includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid payment status: ${paymentStatus}`,
        });
      }
      booking.paymentStatus = paymentStatus;
    }

    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate('room', 'roomNumber title type pricePerNight');

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      booking: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users for admin
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    // Aggregate booking counts per user
    const userBookingCounts = await Booking.aggregate([
      {
        $group: {
          _id: '$user',
          bookingCount: { $sum: 1 },
          totalSpent: { $sum: '$totalPrice' },
        },
      },
    ]);

    const countsMap = {};
    userBookingCounts.forEach((item) => {
      if (item._id) {
        countsMap[item._id.toString()] = {
          count: item.bookingCount,
          totalSpent: item.totalSpent,
        };
      }
    });

    const enrichedUsers = users.map((u) => {
      const info = countsMap[u._id.toString()] || { count: 0, totalSpent: 0 };
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone,
        createdAt: u.createdAt,
        bookingCount: info.count,
        totalSpent: info.totalSpent,
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedUsers.length,
      users: enrichedUsers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (Customer <-> Admin)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either customer or admin',
      });
    }

    // Prevent demoting self
    if (req.user._id.toString() === req.params.id && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'You cannot revoke your own administrator privileges',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllBookings,
  updateBookingStatus,
  getAllUsers,
  updateUserRole,
};
