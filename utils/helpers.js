/**
 * A utility function to conditionally join CSS class names together.
 * @param {...(string|boolean|null|undefined)} classes - A list of classes to potentially join.
 * @returns {string} A string of space-separated class names.
 */
export const cn = (...classes) => classes.filter(Boolean).join(' ');

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
