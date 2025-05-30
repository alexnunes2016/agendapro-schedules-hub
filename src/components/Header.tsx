
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Menu, X, Moon, Sun } from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header = ({ darkMode, toggleDarkMode }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm fixed w-full z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800 dark:text-white">AgendoPro</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Funcionalidades
            </a>
            <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Preços
            </a>
            <Link to="/demo" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Demonstração
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="text-gray-600 dark:text-gray-300"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link to="/register">
                <Button>Começar Grátis</Button>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="text-gray-600 dark:text-gray-300"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t dark:border-gray-700">
            <div className="flex flex-col space-y-4 pt-4">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Funcionalidades
              </a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Preços
              </a>
              <Link to="/demo" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Demonstração
              </Link>
              <Link to="/login">
                <Button variant="ghost" className="justify-start">Entrar</Button>
              </Link>
              <Link to="/register">
                <Button className="justify-start">Começar Grátis</Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
