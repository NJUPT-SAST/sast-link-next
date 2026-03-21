export type ErrorState = { error: false } | { error: true; errMsg: string };

/**
 * Creates a React setState updater function for error state.
 * When `to` is a string, returns an updater that sets the error.
 * When `to` is false, returns an updater that clears the error.
 *
 * Usage: setError(handleError("some error")) or setError(handleError(false))
 */
export function handleError(
  to: false | string,
): (prev: ErrorState) => ErrorState {
  if (to) {
    return (prev) =>
      prev.error && prev.errMsg === to ? prev : { error: true, errMsg: to };
  }
  return (prev) => (prev.error ? { error: false } : prev);
}
