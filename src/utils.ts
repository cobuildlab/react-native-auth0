import { ErrorCallbackType } from './types';

/**.
 * Get the current timestamp in seconds
 *
 * @returns {number} the timestamp
 */
export function getTimestamp(): number {
  return Math.round(new Date().getTime() / 1000);
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
