import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import ActivityLog from '../models/ActivityLog.js';

/**
 * List all users (doctors and nurses) - admin only
 */
export const getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const filter = { role: { $in: ['doctor', 'nurse'] } };
    if (role) filter.role = role;
    const users = await User.find(filter).select('name email phone role createdAt').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

/**
 * System analytics - counts for dashboard
 */
export const getAnalytics = async (req, res, next) => {
  try {
    const [doctorCount, nurseCount, patientCount, appointmentStats, recentActivity] = await Promise.all([
      User.countDocuments({ role: 'doctor' }),
      User.countDocuments({ role: 'nurse' }),
      Patient.countDocuments(),
      Appointment.aggregate([
        { $match: { appointmentDate: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      ActivityLog.find().sort({ createdAt: -1 }).limit(20).populate('userId', 'name role'),
    ]);

    const statsByStatus = {};
    appointmentStats.forEach((s) => (statsByStatus[s._id] = s.count));

    res.status(200).json({
      success: true,
      data: {
        doctorCount,
        nurseCount,
        patientCount,
        appointmentStats: statsByStatus,
        recentActivity,
      },
    });
  } catch (err) {
    next(err);
  }
};
