export interface Integration {
  name: string;
  track(event: string, properties: Record<string, any>, userId?: string): Promise<void>;
  identify(userId: string, traits: Record<string, any>): Promise<void>;
}

export abstract class BaseIntegration implements Integration {
  abstract name: string;

  constructor(protected debug: boolean = false) {}

  abstract track(event: string, properties: Record<string, any>, userId?: string): Promise<void>;
  abstract identify(userId: string, traits: Record<string, any>): Promise<void>;

  protected log(...args: any[]): void {
    if (this.debug) {
      console.log(`[CodeTrack ${this.name}]`, ...args);
    }
  }

  protected logError(...args: any[]): void {
    console.error(`[CodeTrack ${this.name}]`, ...args);
  }
}