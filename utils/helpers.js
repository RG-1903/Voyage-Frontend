import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- ADDED: Get Backend API URL from Vercel Environment Variable ---
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- UPDATED: getAssetUrl ---
// This function now prepends the full backend URL
// This will fix all broken images (e.g., in Admin Panel)
export const getAssetUrl = (path) => {
  if (!path) {
    // Return a default placeholder image if path is missing
    return 'https://via.placeholder.com/300x200.png?text=No+Image';
  }
  // Check if path is already a full URL (less likely, but good practice)
  if (path.startsWith('http')) {
    return path;
  }
  // Prepend the API_URL
  // Example: 'uploads/image.jpg' becomes 'https://voyage-backend.vercel.app/uploads/image.jpg'
  return `${API_URL}/${path}`;
};


export const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to decode JWT:', e);
    return null;
  }
};