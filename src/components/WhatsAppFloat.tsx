
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppFloat = () => {
  const phoneNumber = "5516992013584";
  const message = "Olá! Gostaria de saber mais sobre o AgendoPro";
  
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 group"
        size="sm"
      >
        <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
      </Button>
      
      {/* Pulse animation */}
      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
      
      {/* Tooltip */}
      <div className="absolute bottom-16 right-0 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Fale conosco no WhatsApp
      </div>
    </div>
  );
};

export default WhatsAppFloat;
