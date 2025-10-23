import { VercelRequest, VercelResponse } from "@vercel/node";

type RateLimitStore = Record<
  string,
  {
    count: number;
    resetTime: number;
  }
>;

// In-memory store for rate limiting
const store: RateLimitStore = {};

type RateLimitOptions = {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum number of requests per window
  keyGenerator?: (req: VercelRequest) => string; // Function to generate unique key
  skipSuccessfulRequests?: boolean; // Whether to skip counting successful requests
  skipFailedRequests?: boolean; // Whether to skip counting failed requests
};

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
};

export class RateLimiter {
  private options: Required<RateLimitOptions>;

  constructor(options: RateLimitOptions) {
    this.options = {
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      keyGenerator: (req: VercelRequest) => this.getClientIp(req),
      ...options,
    };
  }

  private getClientIp(req: VercelRequest): string {
    const forwarded = req.headers["x-forwarded-for"];
    const realIp = req.headers["x-real-ip"];

    if (forwarded) {
      return Array.isArray(forwarded) ? forwarded[0] : forwarded.split(",")[0];
    }

    if (realIp) {
      return Array.isArray(realIp) ? realIp[0] : realIp;
    }

    return req.socket?.remoteAddress || "unknown";
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();
    Object.keys(store).forEach((key) => {
      if (store[key].resetTime <= now) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete store[key];
      }
    });
  }

  checkLimit(req: VercelRequest): RateLimitResult {
    this.cleanupExpiredEntries();

    const key = this.options.keyGenerator(req);
    const now = Date.now();
    const resetTime = now + this.options.windowMs;

    if (!store[key]) {
      store[key] = {
        count: 0,
        resetTime,
      };
    }

    // Reset if window expired
    if (store[key].resetTime <= now) {
      store[key] = {
        count: 0,
        resetTime,
      };
    }

    const current = store[key];
    const remaining = Math.max(0, this.options.maxRequests - current.count);

    return {
      success: current.count < this.options.maxRequests,
      limit: this.options.maxRequests,
      remaining,
      resetTime: current.resetTime,
    };
  }

  consume(req: VercelRequest): RateLimitResult {
    const result = this.checkLimit(req);

    if (result.success) {
      const key = this.options.keyGenerator(req);
      store[key].count++;
      result.remaining--;
    }

    return result;
  }

  // Middleware function for easy integration
  middleware() {
    return (req: VercelRequest, res: VercelResponse, next: () => void) => {
      const result = this.consume(req);

      // Add rate limit headers
      res.setHeader("X-RateLimit-Limit", result.limit);
      res.setHeader("X-RateLimit-Remaining", result.remaining);
      res.setHeader(
        "X-RateLimit-Reset",
        new Date(result.resetTime).toISOString()
      );

      if (!result.success) {
        return res.status(429).json({
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many requests, please try again later.",
            retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
          },
        });
      }

      next();
    };
  }
}

// Predefined rate limiters for common use cases
export const createPhotographRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 30, // 30 requests per 15 minutes per IP
});

export const generalApiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute per IP
});
