const STORAGE_PREFIX = 'codetrack_';

export class Storage {
  private storageKey: string;

  constructor(projectId: string) {
    this.storageKey = `${STORAGE_PREFIX}${projectId}`;
  }

  getUserId(): string | null {
    try {
      const data = this.getData();
      return data.userId || null;
    } catch {
      return null;
    }
  }

  setUserId(userId: string): void {
    const data = this.getData();
    data.userId = userId;
    this.setData(data);
  }

  getUserTraits(): Record<string, any> | null {
    try {
      const data = this.getData();
      return data.traits || null;
    } catch {
      return null;
    }
  }

  setUserTraits(traits: Record<string, any>): void {
    const data = this.getData();
    data.traits = { ...data.traits, ...traits };
    this.setData(data);
  }

  clearUser(): void {
    const data = this.getData();
    delete data.userId;
    delete data.traits;
    this.setData(data);
  }

  private getData(): Record<string, any> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private setData(data: Record<string, any>): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }
}