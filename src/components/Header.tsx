import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Calendar } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            <span className="text-xl sm:text-2xl font-bold text-gray-900">AgendoPro</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link to="/funcionalidades" className="text-gray-600 hover:text-blue-600 transition-colors text-sm lg:text-base">
              Funcionalidades
            </Link>
            <Link to="/precos" className="text-gray-600 hover:text-blue-600 transition-colors text-sm lg:text-base">
              Preços
            </Link>
            <Link to="/demonstracao" className="text-gray-600 hover:text-blue-600 transition-colors text-sm lg:text-base">
              Demonstração
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <Link to="/login">
              <Button variant="default" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Teste Grátis</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-3 pb-4 border-t">
            <div className="flex flex-col space-y-3 pt-4">
              <Link 
                to="/funcionalidades" 
                className="text-gray-600 hover:text-blue-600 transition-colors py-2 px-2 rounded hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Funcionalidades
              </Link>
              <Link 
                to="/precos" 
                className="text-gray-600 hover:text-blue-600 transition-colors py-2 px-2 rounded hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Preços
              </Link>
              <Link 
                to="/demonstracao" 
                className="text-gray-600 hover:text-blue-600 transition-colors py-2 px-2 rounded hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Demonstração
              </Link>
              <div className="flex flex-col space-y-2 pt-3 border-t">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="default" className="w-full justify-start bg-blue-600 text-white hover:bg-blue-700" size="sm">Entrar</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full" size="sm">Teste Grátis</Button>
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
