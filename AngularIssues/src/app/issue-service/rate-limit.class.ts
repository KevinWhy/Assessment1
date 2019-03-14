/* Tells other scripts how many requests they can still send...
*/
export interface RateLimit {
  readonly remaining: number; // # of requests remaining.
  readonly limit: number;   // Max # of requests you can send
  readonly resetDate: Date; // When the limit resets
}