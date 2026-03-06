/**
 * Simple activity logger - logs to ActivityLog model
 */
import ActivityLog from '../models/ActivityLog.js';

export const logActivity = async (userId, action, resource = null, resourceId = null, metadata = {}) => {
  try {
    await ActivityLog.create({
      userId,
      action,
      resource,
      resourceId,
      metadata,
    });
  } catch (err) {
    console.error('Activity log error:', err.message);
  }
};
