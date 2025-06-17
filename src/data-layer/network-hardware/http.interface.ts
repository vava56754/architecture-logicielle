export interface IHTTP {
  get(url: string, headers?: Record<string, string>): Promise<any>;
  post(url: string, data: any, headers?: Record<string, string>): Promise<any>;
  put(url: string, data: any, headers?: Record<string, string>): Promise<any>;
  delete(url: string, headers?: Record<string, string>): Promise<any>;
  setBaseUrl(url: string): void;
  setTimeout(ms: number): void;
}
