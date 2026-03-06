const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function getToken() {
  return localStorage.getItem('token');
}

export async function api(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const authApi = {
  login: (email, password) => api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  registerUser: (body) => api('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
};

export const patientsApi = {
  list: (params) => api('/patients' + (params?.phone ? `?phone=${encodeURIComponent(params.phone)}` : '')),
  get: (id) => api(`/patients/${id}`),
  create: (body) => api('/patients', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => api(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
};

export const appointmentsApi = {
  list: (params) => {
    const q = new URLSearchParams(params).toString();
    return api('/appointments' + (q ? `?${q}` : ''));
  },
  get: (id) => api(`/appointments/${id}`),
  create: (body) => api('/appointments', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => api(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  checkIn: (id) => api(`/appointments/${id}/check-in`, { method: 'POST' }),
  slots: (doctorId, date) => api(`/appointments/slots?doctorId=${doctorId}&date=${date}`),
};

export const doctorsApi = {
  list: () => api('/doctors'),
  queue: (doctorId) => api('/doctors/queue' + (doctorId ? `?doctorId=${doctorId}` : '')),
  availability: (doctorId) => api('/doctors/availability' + (doctorId ? `?doctorId=${doctorId}` : '')),
  setAvailability: (body) => api('/doctors/availability', { method: 'PUT', body: JSON.stringify(body) }),
};

export const adminApi = {
  users: (role) => api('/admin/users' + (role ? `?role=${role}` : '')),
  analytics: () => api('/admin/analytics'),
};
