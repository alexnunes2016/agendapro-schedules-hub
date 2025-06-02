
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Eye, EyeOff, MoreHorizontal, Trash2, Mail, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfessionals } from "@/hooks/useProfessionals";

const ProfessionalsList = () => {
  const { professionals, loading, toggleProfessionalStatus, deleteProfessional } = useProfessionals();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Profissionais</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando profissionais...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Profissionais</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {professionals.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum profissional cadastrado ainda</p>
            <p className="text-sm text-gray-500 mt-2">
              Clique em "Novo Profissional" para cadastrar seu primeiro profissional
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {professionals.map((professional) => (
              <div
                key={professional.id}
                className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{professional.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span>{professional.email}</span>
                        {professional.phone && (
                          <>
                            <Phone className="h-3 w-3 ml-2" />
                            <span>{professional.phone}</span>
                          </>
                        )}
                      </div>
                      {professional.specialization && (
                        <p className="text-xs text-gray-500 mt-1">{professional.specialization}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={professional.is_active ? "default" : "secondary"}>
                      {professional.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                    
                    <Badge variant="outline">
                      {professional.role}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => toggleProfessionalStatus(professional.id, professional.is_active)}
                        >
                          {professional.is_active ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Desativar
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Ativar
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteProfessional(professional.id, professional.name)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfessionalsList;
