/**
 * A utility function to conditionally join CSS class names together.
 * @param {...(string|boolean|null|undefined)} classes - A list of classes to potentially join.
 * @returns {string} A string of space-separated class names.
 */
export const cn = (...classes) => classes.filter(Boolean).join(' ');

// --- FIX: Ensure this matches your Vercel backend deployment URL ---
export const BACKEND_BASE_URL = 'https://voyage-backend-five.vercel.app'; // Replace if your URL is different
export const API_BASE_URL = `${BACKEND_BASE_URL}/api`;

/**
 * Constructs the absolute URL for an asset hosted by the backend.
 * Handles both relative paths (like 'uploads/...') and potentially absolute URLs already stored.
 * @param {string} path - The path or URL from the database (e.g., 'uploads/image.jpg').
 * @returns {string} The full absolute URL (e.g., 'https://your-backend.vercel.app/uploads/image.jpg').
 */
export const getAssetUrl = (path) => {
    if (!path) return ''; // Return empty string if path is missing
    // If it's already an absolute URL, return it directly
    if (/^https?:\/\//i.test(path)) return path;
    // Remove leading slash if present, then join with the backend base URL
    const normalized = String(path).replace(/^\/+/, '');
    return `${BACKEND_BASE_URL}/${normalized}`;
};


/**
 * Decodes a JSON Web Token (JWT) to extract its payload.
 * This is a simple, client-side decoder and does NOT verify the token's signature.
 * It's safe to use for reading non-sensitive data like username or email from the payload.
 * @param {string} token - The JWT string.
 * @returns {object|null} The decoded payload object, or null if decoding fails.
 */
export const decodeJwt = (token) => {
    if (!token) return null;
    try {
        // The payload is the second part of the token, base64-encoded.
        const base64Url = token.split('.')[1];
        // Replace characters to make it valid base64, then decode.
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to decode JWT:", e);
        return null;
    }
};