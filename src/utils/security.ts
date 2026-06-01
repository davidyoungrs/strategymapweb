/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Validates that an object property key is safe for bracket notation operations,
 * preventing Prototype Pollution security vulnerabilities.
 */
export function isSafeKey(key: any): boolean {
  if (typeof key !== 'string') return false;
  return key !== '__proto__' && key !== 'constructor' && key !== 'prototype';
}
