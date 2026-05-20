const BASE_URL = 'http://localhost:5000/api';

// Helper to get token from localStorage
const getToken = () => localStorage.getItem('token');

// ─── AUTH ────────────────────────────────────────────────

export const registerUser = async (name, email, phone, password) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone, password }),
  });
  return res.json();
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const getMe = async () => {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

// ─── CONSULTATIONS ───────────────────────────────────────

export const bookConsultation = async (name, phone, email, message = '') => {
  const res = await fetch(`${BASE_URL}/consultations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ name, phone, email, message }),
  });
  return res.json();
};

export const getMyConsultations = async () => {
  const res = await fetch(`${BASE_URL}/consultations`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};