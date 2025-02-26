/**
 * Mock Redis implementation for build time
 * This prevents Redis connection errors during Vercel builds
 */

class MockRedis {
  private store: Map<string, any>;

  constructor() {
    this.store = new Map();
  }

  async get(key: string): Promise<any> {
    return this.store.get(key) || null;
  }

  async set(key: string, value: any, options?: any): Promise<'OK'> {
    this.store.set(key, value);
    return 'OK';
  }

  async incr(key: string): Promise<number> {
    const currentValue = this.store.get(key) || 0;
    const newValue = currentValue + 1;
    this.store.set(key, newValue);
    return newValue;
  }

  async expire(key: string, seconds: number): Promise<number> {
    if (!this.store.has(key)) return 0;
    // In a real implementation, this would set an expiry
    // For mock purposes, we just return success
    return 1;
  }

  async del(key: string): Promise<number> {
    const existed = this.store.has(key);
    this.store.delete(key);
    return existed ? 1 : 0;
  }

  async exists(key: string): Promise<number> {
    return this.store.has(key) ? 1 : 0;
  }
  
  async ping(): Promise<string> {
    return 'PONG';
  }
}

export default MockRedis;
