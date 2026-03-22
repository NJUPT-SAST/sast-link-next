/**
 * Polyfill fetch API globals for Jest + jsdom + MSW v2.
 *
 * This file runs in `setupFiles` (before jsdom loads), so Node built-in
 * globals are still available. We capture and re-define them as
 * non-configurable so jsdom cannot strip them.
 *
 * @see https://mswjs.io/docs/faq#requestresponsetextencoder-is-not-defined-jest
 */

import { TextDecoder, TextEncoder } from "node:util";

// Capture Node built-in fetch globals before jsdom can remove them
const nodeGlobals = {
  fetch: globalThis.fetch,
  Headers: globalThis.Headers,
  Request: globalThis.Request,
  Response: globalThis.Response,
  FormData: globalThis.FormData,
  Blob: globalThis.Blob,
  ReadableStream: globalThis.ReadableStream,
};

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder, configurable: true },
  TextEncoder: { value: TextEncoder, configurable: true },
  fetch: { value: nodeGlobals.fetch, writable: true, configurable: true },
  Headers: { value: nodeGlobals.Headers, configurable: true },
  Request: { value: nodeGlobals.Request, configurable: true },
  Response: { value: nodeGlobals.Response, configurable: true },
  FormData: { value: nodeGlobals.FormData, configurable: true },
  Blob: { value: nodeGlobals.Blob, configurable: true },
  ReadableStream: { value: nodeGlobals.ReadableStream, configurable: true },
});
