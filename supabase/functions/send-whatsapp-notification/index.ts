
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WhatsAppRequest {
  appointmentId: string;
  clientName: string;
  clientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { appointmentId, clientName, clientPhone, appointmentDate, appointmentTime, serviceName }: WhatsAppRequest = await req.json();

    // Buscar configurações do sistema para WhatsApp
    const { data: whatsappSettings, error: settingsError } = await supabaseClient
      .from('system_settings')
      .select('setting_value')
      .in('setting_key', ['whatsapp_webhook_url', 'whatsapp_enabled']);

    if (settingsError) {
      throw new Error(`Erro ao buscar configurações: ${settingsError.message}`);
    }

    const webhookUrl = whatsappSettings.find(s => s.setting_key === 'whatsapp_webhook_url')?.setting_value as string;
    const whatsappEnabled = whatsappSettings.find(s => s.setting_key === 'whatsapp_enabled')?.setting_value as boolean;

    if (!whatsappEnabled || !webhookUrl || webhookUrl === '""') {
      console.log('WhatsApp não habilitado ou webhook não configurado');
      return new Response(JSON.stringify({ success: false, message: 'WhatsApp não configurado' }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Formatear a mensagem
    const message = `🗓️ *Confirmação de Agendamento*

Olá ${clientName}!

Seu agendamento foi confirmado com sucesso:

📅 Data: ${new Date(appointmentDate).toLocaleDateString('pt-BR')}
🕐 Horário: ${appointmentTime}
${serviceName ? `🔧 Serviço: ${serviceName}` : ''}

Aguardamos você!

_AgendoPro_`;

    // Enviar para o webhook N8N
    const webhookResponse = await fetch(webhookUrl.replace(/"/g, ''), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: clientPhone,
        message: message,
        appointmentId: appointmentId
      }),
    });

    if (!webhookResponse.ok) {
      throw new Error(`Erro no webhook: ${webhookResponse.status}`);
    }

    console.log('WhatsApp enviado com sucesso');

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Notificação WhatsApp enviada com sucesso' 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Erro na função send-whatsapp-notification:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
