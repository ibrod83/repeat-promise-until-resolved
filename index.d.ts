/**
 * This function repeatedly calls a Promise factory function until the promise is resolved, 
 * or until the specified conditions are met.
 *
 * @template T The type of value the Promise will resolve to.
 *
 * @param {() => Promise<T>} promiseFactory A factory function that returns a new instance of the Promise to be repeated.
 * @param {Object} [config] An optional configuration object.
 * @param {(error: Error, attempts: number) => Promise<void>} [config.onError] A function to be called when an error occurs.
 * @param {(error: Error) => Promise<boolean>} [config.shouldStop] A function that determines whether the process should stop.
 * @param {(attempts: number) => Promise<void>} [config.onAttempt] A function to be called at each attempt.
 * @param {number} [config.delay] The delay between attempts in milliseconds.
 * @param {number} [config.maxAttempts] The maximum number of attempts.
 * @param {number} [config.timeout] A time limit for the promise to be resolved.
 * @param {number} [attempts=0] The initial number of attempts.
 *
 * @returns {Promise<T>} Returns a Promise that will resolve to the value provided by the promiseFactory, or it will reject with an error.
 */
declare function repeatPromiseUntilResolved<T>(
  promiseFactory: () => Promise<T>,
  config?: {
    onError?: (error: Error, attempts: number) => Promise<void>;
    shouldStop?: (error: Error) => Promise<boolean>;
    onAttempt?: (attempts: number) => Promise<void>;
    delay?: number;
    maxAttempts?: number;
    timeout?: number;
  },
  attempts?: number
): Promise<T>;

  
  export default repeatPromiseUntilResolved;

  