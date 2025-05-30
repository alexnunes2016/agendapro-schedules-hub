
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Pronto para modernizar seus agendamentos?
      </h3>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        Comece gratuitamente hoje mesmo e veja a diferença em sua gestão.
      </p>
      <Link to="/register">
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg">
          Começar Grátis Agora
        </Button>
      </Link>
    </section>
  );
};

export default CTA;
