// Simple API rate limiter utility
class RateLimiter {
  constructor(maxRequests = 10, windowMs = 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    this.requests.push(now);
    return true;
  }
}

// Global rate limiter instance
// Instantiated reliably across Client / Server hydration boundaries
export const apiLimiter = new RateLimiter(10, 1000); // 10 requests per second

// Wrapper for axios requests with rate limiting
export const rateLimitedRequest = async (axiosCall) => {
  // If running on the server side (SSR), skip rate limiting or execute call directly
  if (typeof window === 'undefined') {
    return axiosCall();
  }

  if (!apiLimiter.canMakeRequest()) {
    // Return a structured error matching standard Axios error structures
    const error = new Error('Too many requests, please wait');
    error.name = 'RateLimitError';
    throw error;
  }
  return axiosCall();
};
