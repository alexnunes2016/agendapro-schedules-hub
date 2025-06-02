
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AppointmentData {
  id: string;
  client_name: string;
  client_phone: string;
  appointment_date: string;
  appointment_time: string;
  service_name?: string;
}

export const useWhatsAppNotification = () => {
  const { toast } = useToast();

  const sendWhatsAppNotification = async (appointmentData: AppointmentData) => {
    try {
      // Verificar se WhatsApp está habilitado
      const { data: settings, error: settingsError } = await (supabase as any)
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'whatsapp_enabled')
        .single();

      if (settingsError || !settings?.setting_value) {
        console.log('WhatsApp não habilitado');
        return { success: false, message: 'WhatsApp não habilitado' };
      }

      // Chamar edge function
      const { data, error } = await supabase.functions.invoke('send-whatsapp-notification', {
        body: {
          appointmentId: appointmentData.id,
          clientName: appointmentData.client_name,
          clientPhone: appointmentData.client_phone,
          appointmentDate: appointmentData.appointment_date,
          appointmentTime: appointmentData.appointment_time,
          serviceName: appointmentData.service_name
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        toast({
          title: "WhatsApp enviado",
          description: "Notificação enviada com sucesso para o cliente",
        });
        return { success: true };
      } else {
        console.log('WhatsApp não configurado ou erro no envio');
        return { success: false, message: data?.message || 'Erro no envio' };
      }

    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      toast({
        title: "Erro no WhatsApp",
        description: "Não foi possível enviar a notificação WhatsApp",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  return { sendWhatsAppNotification };
};
