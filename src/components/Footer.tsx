
import { Calendar } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Calendar className="h-6 w-6 text-blue-400" />
          <span className="text-xl font-bold">AgendoPro</span>
        </div>
        <p className="text-gray-400">
          © 2025 AgendoPro. Todos os direitos reservados.
        </p>
        <p className="text-gray-400 mt-2">
          Sistema de agendamentos profissional
        </p>
      </div>
    </footer>
  );
};

export default Footer;
