
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method === 'POST') {
      const body = await req.json()
      console.log('Kiwify webhook received:', body)

      // Verificar se é uma venda confirmada
      if (body.event_type === 'sale_approved' || body.event_type === 'sale_confirmed') {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', body.customer_email)
          .single()

        if (profileError) {
          console.error('Error finding user profile:', profileError)
          return new Response(
            JSON.stringify({ error: 'User not found' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
          )
        }

        // Determinar o plano baseado no produto vendido
        let newPlan = 'free'
        const productName = body.product_name?.toLowerCase() || ''
        
        if (productName.includes('básico') || productName.includes('basico')) {
          newPlan = 'basico'
        } else if (productName.includes('profissional')) {
          newPlan = 'profissional'
        } else if (productName.includes('premium')) {
          newPlan = 'premium'
        }

        // Atualizar o plano do usuário
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            plan: newPlan,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id)

        if (updateError) {
          console.error('Error updating user plan:', updateError)
          return new Response(
            JSON.stringify({ error: 'Failed to update plan' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          )
        }

        console.log(`Updated user ${profile.email} to plan ${newPlan}`)

        return new Response(
          JSON.stringify({ success: true, plan: newPlan }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ message: 'Event not processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
