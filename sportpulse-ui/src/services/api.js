// src/services/api.js

const API_URL = process.env.REACT_APP_API_URL;

export const fetchLeagues = async () => {
  const response = await fetch(`${API_URL}/leagues`);
  if (!response.ok) {
    throw new Error('Failed to fetch leagues');
  }
  return response.json();
};

export const fetchSports = async () => {
  const response = await fetch(`${API_URL}/sports`);
  if (!response.ok) {
    throw new Error('Failed to fetch sports');
  }
  return response.json();
};

export const fetchCountries = async () => {
  const response = await fetch(`${API_URL}/countries`);
  if (!response.ok) {
    throw new Error('Failed to fetch countries');
  }
  return response.json();
};
