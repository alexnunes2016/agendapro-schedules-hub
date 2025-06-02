import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Calendar, BarChart3 } from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Enhanced Hero */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-6 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200 text-sm px-4 py-2">
              Sistema de Agendamentos Profissional
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Revolucione Seus
              <span className="text-blue-600 block">Agendamentos</span>
              <span className="text-gray-700">com Tecnologia Avançada</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Nossa plataforma automatiza o envio de confirmações e lembretes via WhatsApp, 
              reduzindo faltas, otimizando sua agenda e melhorando o atendimento ao cliente. 
              Ideal para clínicas, consultórios, salões de beleza, estúdios e diversos tipos 
              de negócios que dependem de agendamentos.
            </p>

            {/* Features Highlight */}
            <div className="grid md:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">WhatsApp Automático</h3>
                <p className="text-sm text-gray-600">Confirmações e lembretes inteligentes</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Agenda Inteligente</h3>
                <p className="text-sm text-gray-600">Sistema otimiza horários automaticamente</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Analytics Avançado</h3>
                <p className="text-sm text-gray-600">Insights para crescer seu negócio</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                  Teste Grátis por 14 Dias
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  Ver Funcionalidades
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <span>✅ Sem cartão de crédito</span>
              <span>✅ Configuração em 5 minutos</span>
              <span>📞 Suporte personalizado 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the sections */}
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />

      {/* Chatwoot Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(d,t) {
              var BASE_URL="https://mychatapp.judahtech.com.br";
              var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
              g.src=BASE_URL+"/packs/js/sdk.js";
              g.defer = true;
              g.async = true;
              s.parentNode.insertBefore(g,s);
              g.onload=function(){
                window.chatwootSDK.run({
                  websiteToken: 'JAvi8jMPBWqUTj4D7p5gBh65',
                  baseUrl: BASE_URL
                })
              }
            })(document,"script");
          `,
        }}
      />
    </div>
  );
};

export default Index;
