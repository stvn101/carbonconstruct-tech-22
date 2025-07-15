// Enhanced Verifier Notification Service
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NotificationPayload {
  epdId: string;
  productName?: string;
  manufacturerName?: string;
  submittedBy?: string;
}

/**
 * Sends notification to verifiers when a new EPD is submitted for review
 */
export async function notifyVerifier(payload: NotificationPayload): Promise<boolean> {
  try {
    console.log('Sending verifier notification for EPD:', payload.epdId);

    // Call the Supabase Edge Function for verifier notification
    const { data, error } = await supabase.functions.invoke('notify-verifier', {
      body: {
        epdId: payload.epdId,
        productName: payload.productName,
        manufacturerName: payload.manufacturerName,
        submittedBy: payload.submittedBy
      }
    });

    if (error) {
      console.error('Error calling notify-verifier function:', error);
      throw error;
    }

    if (!data?.success) {
      throw new Error(data?.error || 'Notification failed');
    }

    console.log('Verifier notification sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Failed to send verifier notification:', error);
    
    // Show user-friendly error message
    toast.error('Failed to notify verifiers. Please try again or contact support.');
    
    return false;
  }
}

/**
 * Notifies verifiers about EPD status changes
 */
export async function notifyStatusChange(
  epdId: string,
  status: 'verified' | 'rejected',
  notes?: string
): Promise<boolean> {
  try {
    // Log the status change in notifications table
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // System notification
        type: 'epd_status_change',
        title: `EPD ${status === 'verified' ? 'Verified' : 'Rejected'}`,
        message: `EPD ${epdId} has been ${status}${notes ? `. Notes: ${notes}` : ''}`,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error logging status change notification:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to notify status change:', error);
    return false;
  }
}

/**
 * Sends batch notifications for multiple EPDs
 */
export async function notifyVerifierBatch(payloads: NotificationPayload[]): Promise<{
  successful: number;
  failed: number;
  errors: string[];
}> {
  const results = {
    successful: 0,
    failed: 0,
    errors: [] as string[]
  };

  for (const payload of payloads) {
    try {
      const success = await notifyVerifier(payload);
      if (success) {
        results.successful++;
      } else {
        results.failed++;
        results.errors.push(`Failed to notify for EPD: ${payload.epdId}`);
      }
    } catch (error) {
      results.failed++;
      results.errors.push(`Error notifying for EPD ${payload.epdId}: ${error}`);
    }
  }

  return results;
}

/**
 * Checks if the notification service is available
 */
export async function checkNotificationService(): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('notify-verifier', {
      body: { test: true }
    });
    
    return !error;
  } catch (error) {
    console.error('Notification service check failed:', error);
    return false;
  }
}

/**
 * Legacy function for backward compatibility
 */
export async function notifyVerifierLegacy(epdId: string): Promise<void> {
  const success = await notifyVerifier({ epdId });
  if (!success) {
    throw new Error('Failed to send verifier notification');
  }
}