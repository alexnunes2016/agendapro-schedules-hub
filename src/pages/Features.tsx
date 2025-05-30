
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  Brain, 
  Clock, 
  Phone,
  FileText,
  BarChart3,
  Zap,
  Shield,
  Smartphone,
  Globe,
  ArrowLeft
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Calendar,
      title: "Agendamento Inteligente",
      description: "Sistema de agendamento com IA que otimiza horários e reduz conflitos automaticamente.",
      highlight: "IA Avançada"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp Automático",
      description: "Envio automático de confirmações, lembretes e reagendamentos via WhatsApp integrado.",
      highlight: "Automação Total"
    },
    {
      icon: Users,
      title: "Gestão de Clientes",
      description: "Base completa de dados dos clientes com histórico de atendimentos e preferências.",
      highlight: "CRM Integrado"
    },
    {
      icon: Brain,
      title: "IA para Atendimento",
      description: "Assistente virtual que responde dúvidas dos clientes e agenda automaticamente.",
      highlight: "Inteligência Artificial"
    },
    {
      icon: Clock,
      title: "Lembretes Automáticos",
      description: "Sistema inteligente de lembretes por WhatsApp, SMS e email.",
      highlight: "Multi-canal"
    },
    {
      icon: Phone,
      title: "Reagendamento Fácil",
      description: "Clientes podem reagendar diretamente pelo WhatsApp com confirmação automática.",
      highlight: "Self-Service"
    },
    {
      icon: FileText,
      title: "Relatórios Detalhados",
      description: "Analytics completo com insights sobre performance e tendências do negócio.",
      highlight: "Business Intelligence"
    },
    {
      icon: BarChart3,
      title: "Dashboard Executivo",
      description: "Visão geral do negócio com métricas em tempo real e KPIs importantes.",
      highlight: "Tempo Real"
    },
    {
      icon: Smartphone,
      title: "Acesso Mobile",
      description: "Plataforma responsiva que funciona perfeitamente em qualquer dispositivo.",
      highlight: "Multi-dispositivo"
    },
    {
      icon: Shield,
      title: "Segurança Avançada",
      description: "Proteção de dados com criptografia e backup automático na nuvem.",
      highlight: "LGPD Compliant"
    },
    {
      icon: Globe,
      title: "Agendamento Online",
      description: "Link personalizado para clientes agendarem 24/7 sem intervenção manual.",
      highlight: "24/7 Disponível"
    },
    {
      icon: Zap,
      title: "Integração Completa",
      description: "Conecta com ferramentas que você já usa: Google Calendar, redes sociais e mais.",
      highlight: "Ecossistema"
    }
  ];

  const targetAudiences = [
    {
      title: "Clínicas Médicas",
      description: "Otimize consultas, exames e procedimentos com agendamento inteligente.",
      benefits: ["Redução de faltas", "Otimização de agenda", "Lembretes automáticos"]
    },
    {
      title: "Salões de Beleza",
      description: "Gerencie serviços, profissionais e horários com facilidade total.",
      benefits: ["Múltiplos profissionais", "Serviços variados", "Fidelização de clientes"]
    },
    {
      title: "Consultórios",
      description: "Solução completa para profissionais liberais e pequenas clínicas.",
      benefits: ["Gestão simplificada", "Prontuário digital", "Controle financeiro"]
    },
    {
      title: "Academias",
      description: "Agende aulas, personal trainers e avaliações físicas automaticamente.",
      benefits: ["Controle de capacidade", "Aulas em grupo", "Planos personalizados"]
    },
    {
      title: "Fisioterapia",
      description: "Controle sessões, evolução do paciente e reagendamentos.",
      benefits: ["Acompanhamento de evolução", "Sessões sequenciais", "Relatórios médicos"]
    },
    {
      title: "Psicologia",
      description: "Mantenha a confidencialidade com sistema seguro e profissional.",
      benefits: ["Privacidade total", "Sessões regulares", "Anotações seguras"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar à Home
              </Button>
            </Link>
            <Link to="/register">
              <Button>Teste Grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200">
            <Brain className="h-4 w-4 mr-1" />
            Tecnologia com Inteligência Artificial
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Funcionalidades que
            <span className="text-blue-600"> Revolucionam </span>
            Seu Negócio
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Descubra como nossa plataforma com IA transforma a gestão de agendamentos, 
            automatiza tarefas repetitivas e impulsiona o crescimento do seu negócio.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Recursos Completos com IA
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cada funcionalidade foi desenvolvida para maximizar sua eficiência e 
              proporcionar a melhor experiência para seus clientes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <feature.icon className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
                    <Badge variant="secondary" className="text-xs">
                      {feature.highlight}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audiences */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perfeito Para Seu Segmento
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nossa IA se adapta às necessidades específicas de cada tipo de negócio, 
              oferecendo soluções personalizadas e eficientes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {targetAudiences.map((audience, index) => (
              <Card key={index} className="border-l-4 border-l-blue-600">
                <CardHeader>
                  <CardTitle className="text-xl">{audience.title}</CardTitle>
                  <p className="text-gray-600">{audience.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {audience.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <Zap className="h-4 w-4 text-green-500 mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Highlight Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <Brain className="h-16 w-16 mx-auto mb-6 text-blue-200" />
          <h2 className="text-3xl font-bold mb-6">
            Inteligência Artificial Avançada
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Nossa IA aprende com os padrões do seu negócio, otimiza automaticamente os agendamentos, 
            previne conflitos de horário e mantém seus clientes sempre informados via WhatsApp.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Automação WhatsApp</h3>
              <p className="text-blue-100 text-sm">
                Confirmações, lembretes e reagendamentos automáticos
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Otimização Inteligente</h3>
              <p className="text-blue-100 text-sm">
                IA que organiza sua agenda para máxima eficiência
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Insights Preditivos</h3>
              <p className="text-blue-100 text-sm">
                Previsões e sugestões baseadas em dados históricos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Pronto para Revolucionar Seus Agendamentos?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de profissionais que já transformaram seus negócios com nossa IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Começar Teste Grátis
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline">
                Ver Demonstração
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
