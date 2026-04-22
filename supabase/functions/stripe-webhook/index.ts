import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@11.1.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    )

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const metadata = session.metadata
      const userId = session.client_reference_id

      if (userId && metadata) {
        const kidIds = (metadata.selectedKidIds || '').split(',').filter(Boolean)
        const activityId = metadata.activityId
        const eventDate = metadata.eventDate
        const adultCount = parseInt(metadata.adultCount || '0')

        const totalParticipants = kidIds.length + (adultCount > 0 ? 1 : 0)
        const amountPerParticipant = totalParticipants > 0 ? (session.amount_total / 100) / totalParticipants : 0

        // 1. Create Invoices/Enrollments as 'paid'
        for (const kidId of kidIds) {
          const { error: insErr } = await supabaseAdmin.from('invoices').insert([{
            parent_id: userId,
            activity_id: activityId,
            child_id: kidId,
            amount: amountPerParticipant,
            status: 'paid',
            event_date: eventDate,
            stripe_session_id: session.id,
            metadata: metadata
          }])
          if (insErr) throw insErr
        }

        if (adultCount > 0) {
          const { error: insErr } = await supabaseAdmin.from('invoices').insert([{
            parent_id: userId,
            activity_id: activityId,
            status: 'paid',
            adult_count: adultCount,
            event_date: eventDate,
            stripe_session_id: session.id,
            metadata: metadata,
            amount: amountPerParticipant
          }])
          if (insErr) throw insErr
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (error) {
    console.error(`Webhook Error: ${error.message}`)
    return new Response(`Webhook Error: ${error.message}`, { status: 400 })
  }
})
