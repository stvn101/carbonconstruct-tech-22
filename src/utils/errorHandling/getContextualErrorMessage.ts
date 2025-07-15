// src/utils/errorHandling/getContextualErrorMessage.ts

import { isNetworkError } from './networkChecker';

export function getContextualErrorMessage(error: Error, context: string): string {
  if (isNetworkError(error)) {
    return `Network issue while ${context}. Retrying...`;
  }

  if (error.message.includes('401')) {
    return `Your session expired while ${context}. Please log in again.`;
  }

  return `Something went wrong while ${context}. Try again.`;
}