/**
 * Generates time slots between start and end time with given interval (minutes).
 * Used for doctor availability and preventing double booking.
 */
export function generateSlots(startTime, endTime, intervalMinutes = 10) {
  const slots = [];
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  let currentMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  while (currentMinutes + intervalMinutes <= endMinutes) {
    const h = Math.floor(currentMinutes / 60);
    const m = currentMinutes % 60;
    const start = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    currentMinutes += intervalMinutes;
    const h2 = Math.floor(currentMinutes / 60);
    const m2 = currentMinutes % 60;
    const end = `${String(h2).padStart(2, '0')}:${String(m2).padStart(2, '0')}`;
    slots.push({ start, end });
  }

  return slots;
}
