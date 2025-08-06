import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

serve(async (req) => {
  console.log('Verification email function triggered')

  const { email } = await req.json()

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), {
      status: 400,
    })
  }

  // Placeholder: Replace with real logic to send the verification email
  console.log(`Sending verification email to ${email}`)

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})

