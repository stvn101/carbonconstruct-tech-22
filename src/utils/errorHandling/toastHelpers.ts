
import { toast } from 'sonner';

/**
 * Toast helpers for error handling
 */

// Export the Set that was previously imported from here
export const shownErrorToasts = new Set<string>();

/**
 * Clears all shown error toast tracking
 */
export const clearShownErrorToasts = (): void => {
  shownErrorToasts.clear();
};

/**
 * Checks if an error toast has already been shown
 */
export const hasErrorToastBeenShown = (errorId: string): boolean => {
  return shownErrorToasts.has(errorId);
};

/**
 * Marks an error toast as shown
 */
export const markErrorToastAsShown = (errorId: string): void => {
  shownErrorToasts.add(errorId);
};

/**
 * Shows an error toast with deduplication
 */
export const showErrorToast = (
  message: string, 
  id: string, 
  options: { duration?: number; persistent?: boolean } = {}
): void => {
  const { duration = 5000, persistent = false } = options;
  
  if (!shownErrorToasts.has(id)) {
    toast.error(message, {
      id,
      duration: persistent ? Infinity : duration
    });
    shownErrorToasts.add(id);
  }
};

/**
 * Shows a success toast with deduplication
 */
export const showSuccessToast = (message: string, id: string): void => {
  if (!shownErrorToasts.has(id)) {
    toast.success(message, { id, duration: 3000 });
    shownErrorToasts.add(id);
  }
};

/**
 * Clears specific error toasts by their IDs
 */
export const clearErrorToasts = (toastIds: string[]): void => {
  toastIds.forEach(id => {
    toast.dismiss(id);
    shownErrorToasts.delete(id);
  });
};
