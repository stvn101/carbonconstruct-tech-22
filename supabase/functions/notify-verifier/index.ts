import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { Resend } from 'npm:resend@4.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { epdId, productName, manufacturerName } = await req.json()

    if (!epdId) {
      return new Response(
        JSON.stringify({ error: 'EPD ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Initialize Resend (if API key is available)
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    
    if (resendApiKey) {
      const resend = new Resend(resendApiKey)
      
      const reviewUrl = `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovable.app')}/verifier/review/${epdId}`
      
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New EPD Submitted for Verification</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Product Details</h3>
            <p><strong>Product Name:</strong> ${productName || 'N/A'}</p>
            <p><strong>Manufacturer:</strong> ${manufacturerName || 'N/A'}</p>
            <p><strong>EPD ID:</strong> ${epdId}</p>
          </div>
          
          <p>A new Environmental Product Declaration has been submitted and requires verification.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${reviewUrl}" 
               style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Review EPD
            </a>
          </div>
          
          <p style="font-size: 12px; color: #666; margin-top: 30px;">
            This email was sent from the CarbonConstruct EPD verification system.<br>
            Standards: ISO 14025, EN 15804, ISO 21930
          </p>
        </div>
      `

      try {
        const emailResult = await resend.emails.send({
          from: 'CarbonConstruct <noreply@carbonconstruct.com.au>',
          to: ['verifier@carbonconstruct.com.au'],
          subject: 'New EPD Submitted for Verification',
          html: emailHtml
        })

        console.log('Email sent successfully:', emailResult)
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        // Continue execution even if email fails
      }
    }

    // Log notification in database
    const { error: logError } = await supabase
      .from('notifications')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // System notification
        type: 'epd_verification',
        title: 'New EPD Submitted',
        message: `EPD for ${productName} by ${manufacturerName} requires verification`,
        created_at: new Date().toISOString()
      })

    if (logError) {
      console.error('Failed to log notification:', logError)
    }

    console.log(`Verifier notification sent for EPD: ${epdId}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Verifier notification sent successfully',
        epdId 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Notification error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send verifier notification', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})