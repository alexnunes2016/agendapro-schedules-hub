
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
        let customerEmail = body.customer_email || body.Customer?.email;
        
        // Se não tiver email no payload, tentar extrair da query string salva
        if (!customerEmail && body.custom_fields) {
          customerEmail = body.custom_fields.email;
        }

        if (!customerEmail) {
          console.error('Customer email not found in webhook payload');
          return new Response(
            JSON.stringify({ error: 'Customer email not found' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', customerEmail)
          .single()

        if (profileError) {
          console.error('Error finding user profile:', profileError)
          return new Response(
            JSON.stringify({ error: 'User not found' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
          )
        }

        // Determinar o plano baseado no produto vendido ou URL
        let newPlan = 'free'
        const productName = body.product_name?.toLowerCase() || ''
        const productId = body.product_id || ''
        
        // Mapear pelos IDs dos produtos da Kiwify
        if (productId === 'dIQXZeM' || productName.includes('básico') || productName.includes('basico')) {
          newPlan = 'basico'
        } else if (productId === 'ChhN5ug' || productName.includes('profissional')) {
          newPlan = 'profissional'
        } else if (productId === 'GasXHJx' || productName.includes('premium')) {
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

        // Log da transação para auditoria
        console.log('Transaction details:', {
          user_id: profile.id,
          user_email: profile.email,
          old_plan: profile.plan,
          new_plan: newPlan,
          product_id: productId,
          product_name: body.product_name,
          transaction_id: body.transaction_id || body.id,
          amount: body.amount || body.value,
          timestamp: new Date().toISOString()
        });

        return new Response(
          JSON.stringify({ 
            success: true, 
            plan: newPlan,
            user_email: profile.email 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ message: 'Event not processed', event_type: body.event_type }),
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
