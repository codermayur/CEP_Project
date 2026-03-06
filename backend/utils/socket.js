/**
 * Socket.io instance holder so controllers can emit queue updates.
 */
let _io = null;

export function setIO(io) {
  _io = io;
}

export function getIO() {
  return _io;
}
