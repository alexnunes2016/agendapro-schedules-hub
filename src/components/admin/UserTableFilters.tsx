
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserTableFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  planFilter: string;
  setPlanFilter: (plan: string) => void;
}

const UserTableFilters = ({ searchTerm, setSearchTerm, planFilter, setPlanFilter }: UserTableFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={planFilter} onValueChange={setPlanFilter}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Filtrar por plano" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os planos</SelectItem>
          <SelectItem value="free">Gratuito</SelectItem>
          <SelectItem value="basico">Básico</SelectItem>
          <SelectItem value="profissional">Profissional</SelectItem>
          <SelectItem value="premium">Premium</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserTableFilters;
