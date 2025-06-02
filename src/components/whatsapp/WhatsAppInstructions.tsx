
const WhatsAppInstructions = () => {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
      <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
        Como configurar o N8N:
      </h4>
      <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
        <li>• Crie um workflow no N8N com trigger "Webhook"</li>
        <li>• Configure a integração com WhatsApp Business API</li>
        <li>• Use os campos: phone, message e appointmentId</li>
        <li>• Copie a URL do webhook e cole acima</li>
      </ul>
    </div>
  );
};

export default WhatsAppInstructions;
