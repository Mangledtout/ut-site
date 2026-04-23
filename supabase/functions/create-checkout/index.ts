import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@11.1.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { activity, selectedKidIds, adultCount, eventDate, contact } = await req.json()

    // Get the user from the Supabase client (passed in the Authorization header)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing Authorization header');
      throw new Error('Missing Authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      console.error('Auth error:', authError);
      throw new Error('Not authenticated: ' + (authError?.message || 'No user found'));
    }

    const totalAmount = (selectedKidIds.length * activity.price_child) + (adultCount * activity.price_adult)

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: activity.name,
              description: `Booking for ${selectedKidIds.length} child(ren) and ${adultCount} adult(s) on ${eventDate}`,
            },
            unit_amount: Math.round(totalAmount * 100), // amount in pence
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/#dash?success=true`,
      cancel_url: `${req.headers.get('origin')}/#dash?canceled=true`,
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: {
        activityId: activity.id,
        parentId: user.id,
        selectedKidIds: selectedKidIds.join(','),
        eventDate,
        adultCount,
        permissions: JSON.stringify(contact.permissions || {})
      },
    })

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
