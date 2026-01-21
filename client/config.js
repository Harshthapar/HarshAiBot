// Simple Environment Configuration
// This file loads environment variables without requiring a build tool

const config = {
    // Backend API URL
    // Can be overridden by setting window.ENV = { BACKEND_URL: 'your-url' } before loading this script
    BACKEND_URL: window.ENV?.BACKEND_URL || 'http://localhost:3000',

    // Add other config variables here as needed
    // API_TIMEOUT: window.ENV?.API_TIMEOUT || 5000,
};

// Export for use in other scripts
window.config = config;
