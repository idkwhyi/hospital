// utils/cookies.js
// Helper functions untuk mengelola cookies

/**
 * Get cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
export const getCookie = (name) => {
    const cookies = document.cookie.split(';')
    const cookie = cookies.find(c => c.trim().startsWith(`${name}=`))
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null
}

/**
 * Set cookie with options
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Expiration in days (optional)
 * @param {string} path - Cookie path (default: '/')
 */
export const setCookie = (name, value, days = 7, path = '/') => {
    let expires = ''
    if (days) {
        const date = new Date()
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
        expires = `; expires=${date.toUTCString()}`
    }
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=${path}`
}

/**
 * Delete cookie by name
 * @param {string} name - Cookie name
 * @param {string} path - Cookie path (default: '/')
 */
export const deleteCookie = (name, path = '/') => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`
}

/**
 * Get access token from cookies
 * @returns {string|null} Access token or null if not found
 */
export const getAccessToken = () => {
    return getCookie('access_token')
}

/**
 * Set access token in cookies
 * @param {string} token - Access token
 * @param {number} days - Expiration in days (default: 7)
 */
export const setAccessToken = (token, days = 7) => {
    setCookie('access_token', token, days)
}

/**
 * Remove access token from cookies
 */
export const removeAccessToken = () => {
    deleteCookie('access_token')
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if token exists
 */
export const isAuthenticated = () => {
    return !!getAccessToken()
}