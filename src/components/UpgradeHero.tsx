
import { Calendar } from "lucide-react";

const UpgradeHero = () => {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <Calendar className="h-10 w-10 text-blue-600" />
        <span className="text-3xl font-bold text-gray-800 dark:text-white">AgendoPro</span>
      </div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
        Escolha o melhor plano para seu negócio
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Desbloqueie todo o potencial do AgendoPro com recursos avançados 
        e suporte especializado para fazer seu negócio crescer.
      </p>
    </div>
  );
};

export default UpgradeHero;
