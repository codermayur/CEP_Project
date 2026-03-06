import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';

let socket = null;

export function getSocket() {
  if (!socket) socket = io(SOCKET_URL, { withCredentials: true });
  return socket;
}

export function joinDoctorRoom(doctorId, onQueueUpdate) {
  const s = getSocket();
  s.emit('join-doctor-room', doctorId);
  s.on('queue-update', onQueueUpdate);
}

export function leaveDoctorRoom(doctorId) {
  const s = getSocket();
  s.emit('leave-doctor-room', doctorId);
  s.off('queue-update');
}
