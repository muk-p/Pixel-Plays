// Optimized Queue-based Rate Limiter for Smooth Mobile Performance
class HighPerformanceLimiter {
  constructor(maxRequests = 10, windowMs = 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requestTimes = [];
    this.queue = [];
  }

  // Processes or delays calls using a non-blocking Promise pipeline
  schedule(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.processQueue();
    });
  }

  processQueue() {
    if (this.queue.length === 0) return;

    const now = Date.now();
    // Prune out expired timestamps from the tracking window
    this.requestTimes = this.requestTimes.filter(time => now - time < this.windowMs);

    // If we have available slots, drain the queue immediately
    while (this.queue.length > 0 && this.requestTimes.length < this.maxRequests) {
      const { fn, resolve, reject } = this.queue.shift();
      this.requestTimes.push(Date.now());
      
      // Execute the request
      fn().then(resolve).catch(reject);
    }

    // If items remain in the queue, schedule a re-evaluation block right when the oldest window expires
    if (this.queue.length > 0) {
      const oldestTime = this.requestTimes[0];
      const timeRemaining = this.windowMs - (now - oldestTime);
      
      setTimeout(() => this.processQueue(), Math.max(timeRemaining, 10));
    }
  }
}

// Global rate limiter instance (10 requests per rolling 1-second window)
export const apiLimiter = new HighPerformanceLimiter(10, 1000);

// Seamless wrapper for your axios execution calls
export const rateLimitedRequest = async (axiosCall) => {
  // If running server-side (SSR), bypass entirely for instant payload processing
  if (typeof window === 'undefined') {
    return axiosCall();
  }

  // Schedules the request to execute cleanly without ever throwing unexpected errors
  return apiLimiter.schedule(axiosCall);
};
