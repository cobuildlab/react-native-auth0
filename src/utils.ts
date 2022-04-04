import jwtDecode from 'jwt-decode';
import { ErrorCallbackType } from './types';

/**.
 * Get the current timestamp in seconds
 *
 * @returns {number} the timestamp
 */
export function getTimestamp(): number {
  return Math.round(new Date().getTime() / 1000);
}

/**
 * @param {string} token - Token to validate.
 * @returns {boolean} Boolean if the token is valid.
 */
export function validateToken(token: string): boolean {
  const tokenObj = jwtDecode<{
    exp: number;
  }>(token);

  return tokenObj.exp > getTimestamp();
}
export class ErrorPublisher {
  private subscribers: Set<ErrorCallbackType> = new Set();

  subscribe(callback: ErrorCallbackType): () => void {
    this.subscribers.add(callback);

    return () => {
      this.subscribers.delete(callback);
    };
  }

  notify(error: Error): void {
    this.subscribers.forEach((item) => {
      item(error);
    });
  }
}
