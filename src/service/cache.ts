export class CacheService {
  get() {}

  async buffer<T>(fn: Promise<T>) {
    await fn;
  }

  async lock(key: string) {
    return true;
  }

  async unlock(key: string) {
    return true;
  }
}
